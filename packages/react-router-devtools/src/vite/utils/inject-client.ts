import type { types as Babel } from "@babel/core"
import type { ParseResult } from "@babel/parser"
import type { NodePath } from "@babel/traverse"

import { gen, parse, t, trav } from "./babel"
const ALL_EXPORTS = ["links"]

const transform = (ast: ParseResult<Babel.File>, clientConfig: string) => {
	const hocs: Array<[string, Babel.Identifier]> = []
	function getHocUid(path: NodePath, hocName: string) {
		const uid = path.scope.generateUidIdentifier(hocName)
		hocs.push([hocName, uid])
		return uid
	}

	const clientConfigObj = JSON.parse(clientConfig)
	// convert plugins array to array of identifiers
	if (clientConfigObj.plugins) {
		clientConfigObj.plugins = clientConfigObj.plugins
			.replace("[", "")
			.replace("]", "")
			.split(",")
			.map((plugin: string) => t.identifier(plugin.trim()))
	}
	const clientConfigExpression = t.objectExpression(
		Object.entries(clientConfigObj).map(([key, value]) =>
			// biome-ignore lint/suspicious/noExplicitAny: we know what we're doing here
			t.objectProperty(t.identifier(key), key === "plugins" ? t.arrayExpression(value as any) : t.valueToNode(value))
		)
	)
	function uppercaseFirstLetter(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
	const transformations: Array<() => void> = []
	trav(ast, {
		ExportDeclaration(path) {
			if (path.isExportDefaultDeclaration()) {
				const declaration = path.get("declaration")
				// prettier-ignore
				const expr = declaration.isExpression()
					? declaration.node
					: declaration.isFunctionDeclaration()
						? toFunctionExpression(declaration.node)
						: undefined
				if (expr) {
					const uid = getHocUid(path, "withViteDevTools")
					declaration.replaceWith(t.callExpression(uid, [expr, clientConfigExpression]))
				}
				return
			}
			if (path.isExportNamedDeclaration()) {
				const decl = path.get("declaration")

				if (decl.isVariableDeclaration()) {
					for (const varDeclarator of decl.get("declarations")) {
						const id = varDeclarator.get("id")
						const init = varDeclarator.get("init")
						const expr = init.node
						if (!expr) return
						if (!id.isIdentifier()) return
						const { name } = id.node

						if (!ALL_EXPORTS.includes(name)) return

						const uid = getHocUid(path, `with${uppercaseFirstLetter(name)}Wrapper`)
						init.replaceWith(t.callExpression(uid, [expr, t.identifier("rdtStylesheet")]))
					}

					return
				}

				if (decl.isFunctionDeclaration()) {
					const { id } = decl.node
					if (!id) return
					const { name } = id
					if (!ALL_EXPORTS.includes(name)) return

					const uid = getHocUid(path, `with${uppercaseFirstLetter(name)}Wrapper`)
					decl.replaceWith(
						t.variableDeclaration("const", [
							t.variableDeclarator(
								t.identifier(name),
								t.callExpression(uid, [toFunctionExpression(decl.node), t.identifier("rdtStylesheet")])
							),
						])
					)
				}

				// Handle `export { App as default };`
				const specifiers = path.node.specifiers
				for (const specifier of specifiers) {
					if (
						t.isExportSpecifier(specifier) &&
						t.isIdentifier(specifier.exported) &&
						specifier.exported.name === "default" &&
						t.isIdentifier(specifier.local)
					) {
						const localName = specifier.local.name
						const uid = getHocUid(path, "withViteDevTools")

						// Insert the wrapped default export
						transformations.push(() => {
							path.insertBefore(
								t.exportDefaultDeclaration(t.callExpression(uid, [t.identifier(localName), clientConfigExpression]))
							)

							// Remove the original export specifier
							const remainingSpecifiers = path.node.specifiers.filter(
								(s) => !(t.isExportSpecifier(s) && t.isIdentifier(s.exported) && s.exported.name === "default")
							)
							if (remainingSpecifiers.length > 0) {
								path.replaceWith(t.exportNamedDeclaration(null, remainingSpecifiers, path.node.source))
							} else {
								path.remove()
							}
						})
					}
				}
			}
		},
	})
	for (const transformation of transformations) {
		transformation()
	}
	if (hocs.length > 0) {
		ast.program.body.unshift(
			t.importDeclaration(
				hocs.map(([name, identifier]) => t.importSpecifier(identifier, t.identifier(name))),
				t.stringLiteral("react-router-devtools/client")
			),
			t.importDeclaration(
				[t.importDefaultSpecifier(t.identifier("rdtStylesheet"))],
				t.stringLiteral("react-router-devtools/client.css?url")
			)
		)
	}

	return hocs.length > 0
}

function toFunctionExpression(decl: Babel.FunctionDeclaration) {
	return t.functionExpression(decl.id, decl.params, decl.body, decl.generator, decl.async)
}

export function injectRdtClient(code: string, clientConfig: string, pluginImports: string, id: string) {
	const [filePath] = id.split("?")
	const ast = parse(code, { sourceType: "module" })
	const didTransform = transform(ast, clientConfig)
	if (!didTransform) {
		return { code }
	}
	const generatedOutput = gen(ast, { sourceMaps: true, sourceFileName: filePath, filename: id })
	const output = `${pluginImports}\n${generatedOutput.code}`

	if (!output.includes("export const links")) {
		return {
			code: [output, "", `export const links = () => [{ rel: "stylesheet", href: rdtStylesheet }];`].join("\n"),
			map: generatedOutput.map,
		}
	}
	return {
		code: output,
		map: generatedOutput.map,
	}
}
