import type { types as Babel } from "@babel/core"
import type { ParseResult } from "@babel/parser"
import type { NodePath } from "@babel/traverse"
import { gen, parse, t, trav } from "./babel"

const SERVER_MIDDLEWARE_EXPORT = "middleware"
const CLIENT_MIDDLEWARE_EXPORT = "clientMiddleware"
const ALL_MIDDLEWARE_EXPORTS = [SERVER_MIDDLEWARE_EXPORT, CLIENT_MIDDLEWARE_EXPORT]

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
				// e.g., import { someMiddleware as middleware }
				if (ALL_MIDDLEWARE_EXPORTS.includes(localName) && !ALL_MIDDLEWARE_EXPORTS.includes(importedName)) {
					const uniqueName = path.scope.generateUidIdentifier(localName)
					imports.push([localName, uniqueName])
					path.scope.rename(localName, uniqueName.name)
					continue
				}
				const name = importedName
				if (!ALL_MIDDLEWARE_EXPORTS.includes(name)) {
					continue
				}
				const isReimported = specifier.local.name !== name
				const uniqueName = isReimported ? specifier.local : path.scope.generateUidIdentifier(name)
				imports.push([name, uniqueName])
				specifier.local = uniqueName
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

						if (!ALL_MIDDLEWARE_EXPORTS.includes(name)) return

						// If it's an array expression, wrap each element individually
						if (t.isArrayExpression(expr)) {
							// Skip empty arrays
							if (expr.elements.length === 0) return

							const uid =
								name === CLIENT_MIDDLEWARE_EXPORT
									? getClientHocId(path, `with${uppercaseFirstLetter(name)}WrapperSingle`)
									: getServerHocId(path, `with${uppercaseFirstLetter(name)}WrapperSingle`)

							let currentIndex = 0
							const wrappedElements = expr.elements.map((element) => {
								if (!element) return element

								// Handle spread elements specially
								if (t.isSpreadElement(element)) {
									const spreadArg = element.argument
									// Create: ...spreadArg.map((fn, idx) => wrapper(fn, routeId, currentIndex + idx, fn.name || `${routeId}_${name}_${currentIndex + idx}`))
									const fallbackName = `${routeId}_${name}_`
									const mapCallback = t.arrowFunctionExpression(
										[t.identifier("_fn"), t.identifier("_idx")],
										t.callExpression(uid, [
											t.identifier("_fn"),
											t.stringLiteral(routeId),
											t.binaryExpression("+", t.numericLiteral(currentIndex), t.identifier("_idx")),
											t.logicalExpression(
												"||",
												t.memberExpression(t.identifier("_fn"), t.identifier("name")),
												t.binaryExpression(
													"+",
													t.stringLiteral(fallbackName),
													t.binaryExpression("+", t.numericLiteral(currentIndex), t.identifier("_idx"))
												)
											),
										])
									)
									const mappedSpread = t.callExpression(t.memberExpression(spreadArg, t.identifier("map")), [
										mapCallback,
									])
									// We don't know the length at compile time, so we'll just increment by 1000 to avoid conflicts
									// This ensures that any subsequent elements have a higher index
									currentIndex += 1000
									return t.spreadElement(mappedSpread)
								} // Get the middleware name
								let middlewareName: string
								if (t.isFunctionExpression(element) && element.id?.name) {
									// Named function expression
									middlewareName = element.id.name
								} else if (t.isArrowFunctionExpression(element) || (t.isFunctionExpression(element) && !element.id)) {
									// Arrow function or anonymous function expression
									middlewareName = `${routeId}_${name}_${currentIndex}`
								} else if (t.isIdentifier(element)) {
									// Named function reference
									middlewareName = element.name
								} else {
									// Fallback for any other expression
									middlewareName = `${routeId}_${name}_${currentIndex}`
								}

								const wrapped = t.callExpression(uid, [
									element,
									t.stringLiteral(routeId),
									t.numericLiteral(currentIndex),
									t.stringLiteral(middlewareName),
								])
								currentIndex++
								return wrapped
							})

							init.replaceWith(t.arrayExpression(wrappedElements))
						} else {
							// If it's not an array, wrap the whole thing (fallback)
							const uid =
								name === CLIENT_MIDDLEWARE_EXPORT
									? getClientHocId(path, `with${uppercaseFirstLetter(name)}WrapperSingle`)
									: getServerHocId(path, `with${uppercaseFirstLetter(name)}WrapperSingle`)

							init.replaceWith(t.callExpression(uid, [expr, t.stringLiteral(routeId)]))
						}
					}
					return
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
				if (!ALL_MIDDLEWARE_EXPORTS.includes(name)) {
					return
				}

				// Skip re-exported middleware (export { middleware } from "./path")
				if (path.node.source) {
					return
				}

				const binding = path.scope.getBinding(name)

				// Skip if middleware is imported from another module and just re-exported
				if (binding && imports.find(([importedName]) => importedName === name)) {
					// This is an imported middleware being re-exported, skip transformation
					return
				}

				const uid =
					name === CLIENT_MIDDLEWARE_EXPORT
						? getClientHocId(path, `with${uppercaseFirstLetter(name)}WrapperSingle`)
						: getServerHocId(path, `with${uppercaseFirstLetter(name)}WrapperSingle`)

				if (binding?.path.isVariableDeclarator()) {
					// Wrap the variable declarator's initializer
					const init = binding.path.get("init")
					if (init.node && t.isArrayExpression(init.node)) {
						// Skip empty arrays
						if (init.node.elements.length === 0) return

						// If it's an array, wrap each element
						let currentIndex = 0
						const wrappedElements = init.node.elements.map((element) => {
							if (!element) return element

							// Handle spread elements specially
							if (t.isSpreadElement(element)) {
								const spreadArg = element.argument
								const fallbackName = `${routeId}_${name}_`
								const mapCallback = t.arrowFunctionExpression(
									[t.identifier("_fn"), t.identifier("_idx")],
									t.callExpression(uid, [
										t.identifier("_fn"),
										t.stringLiteral(routeId),
										t.binaryExpression("+", t.numericLiteral(currentIndex), t.identifier("_idx")),
										t.logicalExpression(
											"||",
											t.memberExpression(t.identifier("_fn"), t.identifier("name")),
											t.binaryExpression(
												"+",
												t.stringLiteral(fallbackName),
												t.binaryExpression("+", t.numericLiteral(currentIndex), t.identifier("_idx"))
											)
										),
									])
								)
								const mappedSpread = t.callExpression(t.memberExpression(spreadArg, t.identifier("map")), [mapCallback])
								currentIndex += 1000
								return t.spreadElement(mappedSpread)
							} // Get the middleware name
							let middlewareName: string
							if (t.isFunctionExpression(element) && element.id?.name) {
								middlewareName = element.id.name
							} else if (t.isArrowFunctionExpression(element) || (t.isFunctionExpression(element) && !element.id)) {
								middlewareName = `${routeId}_${name}_${currentIndex}`
							} else if (t.isIdentifier(element)) {
								middlewareName = element.name
							} else {
								middlewareName = `${routeId}_${name}_${currentIndex}`
							}

							const wrapped = t.callExpression(uid, [
								element,
								t.stringLiteral(routeId),
								t.numericLiteral(currentIndex),
								t.stringLiteral(middlewareName),
							])
							currentIndex++
							return wrapped
						})

						init.replaceWith(t.arrayExpression(wrappedElements))
					} else if (init.node) {
						// Fallback: wrap the whole thing
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

export function augmentMiddlewareFunctions(code: string, routeId: string, id: string) {
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
