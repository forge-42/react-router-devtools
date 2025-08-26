import type { types as Babel, NodePath } from "@babel/core"
import type { ParseResult } from "@babel/parser"
import { normalizePath } from "vite"
import { gen, parse, t, trav } from "./babel"

const getPropsNameFromFunctionDeclaration = (
	functionDeclaration: t.VariableDeclarator | t.FunctionExpression | t.FunctionDeclaration | t.ArrowFunctionExpression
) => {
	let propsName: string | null = null

	if (functionDeclaration.type === "FunctionExpression") {
		const firstArgument = functionDeclaration.params[0]
		// handles (props) => {}
		if (firstArgument && firstArgument.type === "Identifier") {
			propsName = firstArgument.name
		}
		// handles ({ ...props }) => {}
		if (firstArgument && firstArgument.type === "ObjectPattern") {
			// biome-ignore lint/complexity/noForEach: <explanation>
			firstArgument.properties.forEach((prop) => {
				if (prop.type === "RestElement" && prop.argument.type === "Identifier") {
					propsName = prop.argument.name
				}
			})
		}
		return propsName
	}
	if (functionDeclaration.type === "ArrowFunctionExpression") {
		const firstArgument = functionDeclaration.params[0]
		// handles (props) => {}
		if (firstArgument && firstArgument.type === "Identifier") {
			propsName = firstArgument.name
		}
		// handles ({ ...props }) => {}
		if (firstArgument && firstArgument.type === "ObjectPattern") {
			// biome-ignore lint/complexity/noForEach: <explanation>
			firstArgument.properties.forEach((prop) => {
				if (prop.type === "RestElement" && prop.argument.type === "Identifier") {
					propsName = prop.argument.name
				}
			})
		}
		return propsName
	}
	if (functionDeclaration.type === "FunctionDeclaration") {
		const firstArgument = functionDeclaration.params[0]
		// handles (props) => {}
		if (firstArgument && firstArgument.type === "Identifier") {
			propsName = firstArgument.name
		}
		// handles ({ ...props }) => {}
		if (firstArgument && firstArgument.type === "ObjectPattern") {
			// biome-ignore lint/complexity/noForEach: <explanation>
			firstArgument.properties.forEach((prop) => {
				if (prop.type === "RestElement" && prop.argument.type === "Identifier") {
					propsName = prop.argument.name
				}
			})
		}
		return propsName
	}
	// Arrow function case
	if (
		functionDeclaration.init?.type === "ArrowFunctionExpression" ||
		functionDeclaration.init?.type === "FunctionExpression"
	) {
		const firstArgument = functionDeclaration.init.params[0]
		// handles (props) => {}
		if (firstArgument && firstArgument.type === "Identifier") {
			propsName = firstArgument.name
		}
		// handles ({ ...props }) => {}
		if (firstArgument && firstArgument.type === "ObjectPattern") {
			// biome-ignore lint/complexity/noForEach: <explanation>
			firstArgument.properties.forEach((prop) => {
				if (prop.type === "RestElement" && prop.argument.type === "Identifier") {
					propsName = prop.argument.name
				}
			})
		}
	}
	return propsName
}

const transformJSX = (element: NodePath<t.JSXOpeningElement>, propsName: string | null, file: string) => {
	const loc = element.node.loc
	if (!loc) return
	const line = loc.start.line
	const column = loc.start.column

	const hasDataSource = element.node.attributes.some(
		(attr) =>
			attr.type === "JSXAttribute" && attr.name.type === "JSXIdentifier" && attr.name.name === "data-rrdt-source"
	)
	// Check if props are spread
	const hasSpread = element.node.attributes.some(
		(attr) =>
			attr.type === "JSXSpreadAttribute" && attr.argument.type === "Identifier" && attr.argument.name === propsName
	)

	if (hasSpread || hasDataSource) {
		// Do not inject if props are spread
		return
	}

	// Inject data-source as a string: "<file>:<line>:<column>"
	element.node.attributes.push(
		t.jsxAttribute(t.jsxIdentifier("data-rrdt-source"), t.stringLiteral(`${file}:${line}:${column}`))
	)

	return true
}

const transform = (ast: ParseResult<Babel.File>, file: string) => {
	let didTransform = false

	trav(ast, {
		FunctionDeclaration(functionDeclaration) {
			const propsName = getPropsNameFromFunctionDeclaration(functionDeclaration.node)
			functionDeclaration.traverse({
				JSXOpeningElement(element) {
					const transformed = transformJSX(element, propsName, file)
					if (transformed) {
						didTransform = true
					}
				},
			})
		},
		ArrowFunctionExpression(path) {
			const propsName = getPropsNameFromFunctionDeclaration(path.node)
			path.traverse({
				JSXOpeningElement(element) {
					const transformed = transformJSX(element, propsName, file)
					if (transformed) {
						didTransform = true
					}
				},
			})
		},
		FunctionExpression(path) {
			const propsName = getPropsNameFromFunctionDeclaration(path.node)
			path.traverse({
				JSXOpeningElement(element) {
					const transformed = transformJSX(element, propsName, file)
					if (transformed) {
						didTransform = true
					}
				},
			})
		},
		VariableDeclaration(path) {
			const functionDeclaration = path.node.declarations.find((decl) => {
				return decl.init?.type === "ArrowFunctionExpression" || decl.init?.type === "FunctionExpression"
			})
			if (!functionDeclaration) {
				return
			}
			const propsName = getPropsNameFromFunctionDeclaration(functionDeclaration)

			path.traverse({
				JSXOpeningElement(element) {
					const transformed = transformJSX(element, propsName, file)
					if (transformed) {
						didTransform = true
					}
				},
			})
		},
	})

	return didTransform
}

export function addSourceToJsx(code: string, id: string) {
	const [filePath] = id.split("?")
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const location = filePath?.replace(normalizePath(process.cwd()), "")!

	try {
		const ast = parse(code, {
			sourceType: "module",
			plugins: ["jsx", "typescript"],
		})
		const didTransform = transform(ast, location)
		if (!didTransform) {
			return { code }
		}
		return gen(ast, {
			sourceMaps: true,
			filename: id,
			sourceFileName: filePath,
		})
	} catch (e) {
		return { code }
	}
}
