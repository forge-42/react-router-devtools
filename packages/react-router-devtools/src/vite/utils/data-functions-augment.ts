import type { types as Babel } from "@babel/core"
import type { ParseResult } from "@babel/parser"
import type { NodePath } from "@babel/traverse"
import { gen, parse, t, trav } from "./babel"

const SERVER_COMPONENT_EXPORTS = ["loader", "action"]
const CLIENT_COMPONENT_EXPORTS = ["clientLoader", "clientAction"]
const ALL_EXPORTS = [...SERVER_COMPONENT_EXPORTS, ...CLIENT_COMPONENT_EXPORTS]

const transform = (ast: ParseResult<Babel.File>, routeId: string) => {
	const serverHocs: Array<[string, Babel.Identifier]> = []
	const clientHocs: Array<[string, Babel.Identifier]> = []
	const imports: Array<[string, Babel.Identifier]> = []

	function getServerHocId(path: NodePath, hocName: string) {
		const uid = path.scope.generateUidIdentifier(hocName)
		const hasHoc = serverHocs.find(([name]) => name === hocName)
		if (hasHoc) {
			return uid
		}
		serverHocs.push([hocName, uid])
		return uid
	}
	function getClientHocId(path: NodePath, hocName: string) {
		const uid = path.scope.generateUidIdentifier(hocName)
		const hasHoc = clientHocs.find(([name]) => name === hocName)
		if (hasHoc) {
			return uid
		}
		clientHocs.push([hocName, uid])
		return uid
	}
	function uppercaseFirstLetter(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
	const transformations: Array<() => void> = []

	const importDeclarations: Babel.ImportDeclaration[] = []
	trav(ast, {
		ImportDeclaration(path) {
			const specifiers = path.node.specifiers
			for (const specifier of specifiers) {
				if (!t.isImportSpecifier(specifier) || !t.isIdentifier(specifier.imported)) {
					continue
				}
				const importedName = specifier.imported.name
				const localName = specifier.local.name
				// Handle aliased imports where local name is a target export
				// e.g., import { myLoader as loader }
				if (ALL_EXPORTS.includes(localName) && !ALL_EXPORTS.includes(importedName)) {
					const uniqueName = path.scope.generateUidIdentifier(localName)
					imports.push([localName, uniqueName])
					path.scope.rename(localName, uniqueName.name)
					continue
				}
				const name = importedName
				if (!ALL_EXPORTS.includes(name)) {
					continue
				}
				const isReimported = specifier.local.name !== name
				const uniqueName = isReimported ? specifier.local : path.scope.generateUidIdentifier(name)
				imports.push([name, uniqueName])
				specifier.local = uniqueName
				// Replace the import specifier with a new one
				if (!isReimported) {
					path.scope.rename(name, uniqueName.name)
				}
			}
		},
		ExportDeclaration(path) {
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

						const uid = CLIENT_COMPONENT_EXPORTS.includes(name)
							? getClientHocId(path, `with${uppercaseFirstLetter(name)}Wrapper`)
							: getServerHocId(path, `with${uppercaseFirstLetter(name)}Wrapper`)
						init.replaceWith(t.callExpression(uid, [expr, t.stringLiteral(routeId)]))
					}

					return
				}

				if (decl.isFunctionDeclaration()) {
					const { id } = decl.node
					if (!id) return
					const { name } = id
					if (!ALL_EXPORTS.includes(name)) return

					const uid = CLIENT_COMPONENT_EXPORTS.includes(name)
						? getClientHocId(path, `with${uppercaseFirstLetter(name)}Wrapper`)
						: getServerHocId(path, `with${uppercaseFirstLetter(name)}Wrapper`)
					decl.replaceWith(
						t.variableDeclaration("const", [
							t.variableDeclarator(
								t.identifier(name),
								t.callExpression(uid, [toFunctionExpression(decl.node), t.stringLiteral(routeId)])
							),
						])
					)
				}
			}
		},
		ExportNamedDeclaration(path) {
			const specifiers = path.node.specifiers
			for (const specifier of specifiers) {
				if (!(t.isExportSpecifier(specifier) && t.isIdentifier(specifier.exported))) {
					return
				}
				const name = specifier.exported.name
				if (!ALL_EXPORTS.includes(name)) {
					return
				}

				const uid = CLIENT_COMPONENT_EXPORTS.includes(name)
					? getClientHocId(path, `with${uppercaseFirstLetter(name)}Wrapper`)
					: getServerHocId(path, `with${uppercaseFirstLetter(name)}Wrapper`)
				const binding = path.scope.getBinding(name)

				if (path.node.source) {
					// Special condition: export { loader, action } from "./path"
					const source = path.node.source.value

					importDeclarations.push(
						t.importDeclaration(
							[t.importSpecifier(t.identifier(`_${name}`), t.identifier(name))],
							t.stringLiteral(source)
						)
					)
					transformations.push(() => {
						path.insertBefore(
							t.exportNamedDeclaration(
								t.variableDeclaration("const", [
									t.variableDeclarator(
										t.identifier(name),
										t.callExpression(uid, [t.identifier(`_${name}`), t.stringLiteral(routeId)])
									),
								])
							)
						)
					})

					// Remove the specifier from the exports and add a manual export
					transformations.push(() => {
						const remainingSpecifiers = path.node.specifiers.filter(
							(exportSpecifier) => !(t.isIdentifier(exportSpecifier.exported) && exportSpecifier.exported.name === name)
						)

						path.replaceWith(t.exportNamedDeclaration(null, remainingSpecifiers, path.node.source))

						const newRemainingSpecifiers = path.node.specifiers.length
						if (newRemainingSpecifiers === 0) {
							path.remove()
						}
					})
				} else if (binding?.path.isFunctionDeclaration()) {
					// Replace the function declaration with a wrapped version
					binding.path.replaceWith(
						t.variableDeclaration("const", [
							t.variableDeclarator(
								t.identifier(name),
								t.callExpression(uid, [toFunctionExpression(binding.path.node), t.stringLiteral(routeId)])
							),
						])
					)
				} else if (binding?.path.isVariableDeclarator()) {
					// Wrap the variable declarator's initializer
					const init = binding.path.get("init")
					if (init.node) {
						init.replaceWith(t.callExpression(uid, [init.node, t.stringLiteral(routeId)]))
					}
				} else {
					transformations.push(() => {
						const existingImport = imports.find(([existingName]) => existingName === name)
						const uniqueName = existingImport?.[1].name ?? path.scope.generateUidIdentifier(name).name

						const remainingSpecifiers = path.node.specifiers.filter(
							(exportSpecifier) => !(t.isIdentifier(exportSpecifier.exported) && exportSpecifier.exported.name === name)
						)
						path.replaceWith(t.exportNamedDeclaration(null, remainingSpecifiers, path.node.source))

						// Insert the wrapped export after the modified export statement
						path.insertAfter(
							t.exportNamedDeclaration(
								t.variableDeclaration("const", [
									t.variableDeclarator(
										t.identifier(name),
										t.callExpression(uid, [t.identifier(uniqueName), t.stringLiteral(routeId)])
									),
								]),
								[]
							)
						)
						const newRemainingSpecifiers = path.node.specifiers.length
						if (newRemainingSpecifiers === 0) {
							path.remove()
						}
					})
				}
			}
		},
	})
	for (const transformation of transformations) {
		transformation()
	}
	if (importDeclarations.length > 0) {
		ast.program.body.unshift(...importDeclarations)
	}
	if (serverHocs.length > 0) {
		ast.program.body.unshift(
			t.importDeclaration(
				serverHocs.map(([name, identifier]) => t.importSpecifier(identifier, t.identifier(name))),
				t.stringLiteral("react-router-devtools/server")
			)
		)
	}
	if (clientHocs.length > 0) {
		ast.program.body.unshift(
			t.importDeclaration(
				clientHocs.map(([name, identifier]) => t.importSpecifier(identifier, t.identifier(name))),
				t.stringLiteral("react-router-devtools/client")
			)
		)
	}
	const didTransform = clientHocs.length > 0 || serverHocs.length > 0
	return didTransform
}

function toFunctionExpression(decl: Babel.FunctionDeclaration) {
	return t.functionExpression(decl.id, decl.params, decl.body, decl.generator, decl.async)
}

export function augmentDataFetchingFunctions(code: string, routeId: string, id: string) {
	const [filePath] = id.split("?")
	try {
		const ast = parse(code, { sourceType: "module" })
		const didTransform = transform(ast, routeId)
		if (!didTransform) {
			return { code }
		}
		return gen(ast, { sourceMaps: true, filename: id, sourceFileName: filePath })
	} catch (_e) {
		return { code }
	}
}
