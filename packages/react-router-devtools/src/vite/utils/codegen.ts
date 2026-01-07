import type { types as Babel } from "@babel/core"
import type { ParseResult } from "@babel/parser"
import { gen, parse, t, trav } from "./babel"

// Map of export names to their corresponding Route type
const EXPORT_TYPE_MAP: Record<string, string> = {
	loader: "Route.LoaderArgs",
	action: "Route.ActionArgs",
	clientLoader: "Route.ClientLoaderArgs",
	clientAction: "Route.ClientActionArgs",
	meta: "Route.MetaArgs",
	links: "Route.LinksArgs",
	headers: "Route.HeadersArgs",
	ErrorBoundary: "Route.ErrorBoundaryProps",
	HydrateFallback: "Route.HydrateFallbackProps",
}

// Map of array export names to their corresponding Route type (for variable type annotations)
const ARRAY_EXPORT_TYPE_MAP: Record<string, string> = {
	middleware: "Route.MiddlewareFunction",
	clientMiddleware: "Route.ClientMiddlewareFunction",
}

// Default export gets ComponentProps
const DEFAULT_EXPORT_TYPE = "Route.ComponentProps"

/**
 * Check if a function/arrow function has more than one parameter
 */
function hasMultipleParams(
	node: Babel.FunctionDeclaration | Babel.FunctionExpression | Babel.ArrowFunctionExpression
): boolean {
	return node.params.length > 1
}

/**
 * Check if the first parameter already has a type annotation
 */
function hasTypeAnnotation(
	node: Babel.FunctionDeclaration | Babel.FunctionExpression | Babel.ArrowFunctionExpression
): boolean {
	if (node.params.length === 0) return false
	const firstParam = node.params[0]
	return !!(firstParam as Babel.Identifier).typeAnnotation
}

/**
 * Create a type annotation node for Route.X type
 */
function createRouteTypeAnnotation(typeName: string): Babel.TSTypeAnnotation {
	const [namespace, member] = typeName.split(".")
	return t.tsTypeAnnotation(t.tsTypeReference(t.tsQualifiedName(t.identifier(namespace), t.identifier(member))))
}

/**
 * Create a type annotation node for Route.X[] array type (for variable annotations)
 */
function createVariableArrayTypeAnnotation(typeName: string): Babel.TSTypeAnnotation {
	const [namespace, member] = typeName.split(".")
	const elementType = t.tsTypeReference(t.tsQualifiedName(t.identifier(namespace), t.identifier(member)))
	return t.tsTypeAnnotation(t.tsArrayType(elementType))
}

/**
 * Add type annotation to a variable identifier (for array exports like middleware)
 */
function addTypeToVariable(id: Babel.Identifier, typeName: string): boolean {
	// Skip if already has type annotation
	if (id.typeAnnotation) return false

	id.typeAnnotation = createVariableArrayTypeAnnotation(typeName)
	return true
}

/**
 * Add type annotation to the first parameter (requires at least one param)
 */
function addTypeToFunction(
	node: Babel.FunctionDeclaration | Babel.FunctionExpression | Babel.ArrowFunctionExpression,
	typeName: string
): boolean {
	// Skip if no params - user intentionally doesn't use args
	if (node.params.length === 0) return false

	// Skip if multiple params
	if (hasMultipleParams(node)) return false

	// Skip if already has type annotation
	if (hasTypeAnnotation(node)) return false

	const typeAnnotation = createRouteTypeAnnotation(typeName)
	const firstParam = node.params[0]

	if (t.isIdentifier(firstParam) || t.isObjectPattern(firstParam) || t.isArrayPattern(firstParam)) {
		firstParam.typeAnnotation = typeAnnotation
		return true
	}

	return false
}

/**
 * Check if the Route type import already exists
 */
function hasRouteImport(ast: ParseResult<Babel.File>, importPath: string): boolean {
	for (const node of ast.program.body) {
		if (!t.isImportDeclaration(node)) continue
		if (node.source.value !== importPath) continue

		for (const specifier of node.specifiers) {
			if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported) && specifier.imported.name === "Route") {
				return true
			}
		}
	}
	return false
}

/**
 * Transform the AST to add type annotations to React Router exports
 */
function transform(ast: ParseResult<Babel.File>, filename: string): boolean {
	let modified = false
	const importPath = `./+types/${filename}`

	// Track which local declarations need to be modified for re-exports
	const declarationsToModify = new Map<string, string>()

	trav(ast, {
		// Handle: export function loader() {} or export const loader = () => {}
		ExportNamedDeclaration(path) {
			const decl = path.get("declaration")

			// Handle function declarations: export function loader() {}
			if (decl.isFunctionDeclaration()) {
				const { id } = decl.node
				if (!id) return
				const { name } = id
				const typeName = EXPORT_TYPE_MAP[name]
				if (!typeName) return

				if (addTypeToFunction(decl.node, typeName)) {
					modified = true
				}
				return
			}

			// Handle variable declarations: export const loader = () => {} or export const middleware = []
			if (decl.isVariableDeclaration()) {
				for (const varDeclarator of decl.get("declarations")) {
					const id = varDeclarator.get("id")
					const init = varDeclarator.get("init")

					if (!id.isIdentifier()) continue
					const { name } = id.node

					// Check if it's a function export (loader, action, etc.)
					const funcTypeName = EXPORT_TYPE_MAP[name]
					if (funcTypeName) {
						const initNode = init.node
						if (!initNode) continue

						// Handle arrow functions and function expressions
						if (t.isArrowFunctionExpression(initNode) || t.isFunctionExpression(initNode)) {
							if (addTypeToFunction(initNode, funcTypeName)) {
								modified = true
							}
						}
						continue
					}

					// Check if it's an array export (middleware, clientMiddleware)
					const arrayTypeName = ARRAY_EXPORT_TYPE_MAP[name]
					if (arrayTypeName) {
						const initNode = init.node
						if (!initNode) continue

						// Handle array expressions
						if (t.isArrayExpression(initNode)) {
							if (addTypeToVariable(id.node, arrayTypeName)) {
								modified = true
							}
						}
					}
				}
				return
			}

			// Handle re-exports: export { loader } where loader is declared in file
			// Also handles: export { Component as default }
			const specifiers = path.node.specifiers
			for (const specifier of specifiers) {
				if (!t.isExportSpecifier(specifier) || !t.isIdentifier(specifier.exported)) {
					continue
				}

				const exportedName = specifier.exported.name
				const localName = specifier.local.name

				// Check if this is a default export (export { X as default })
				const isDefaultExport = exportedName === "default"
				const typeName = isDefaultExport ? DEFAULT_EXPORT_TYPE : EXPORT_TYPE_MAP[exportedName]
				if (!typeName) continue

				// Skip re-exports from other files
				if (path.node.source) continue

				// Find the local binding and mark it for modification
				const binding = path.scope.getBinding(localName)
				if (binding) {
					declarationsToModify.set(localName, typeName)
				}
			}
		},

		// Handle: export default function() {} or export default function Component() {}
		ExportDefaultDeclaration(path) {
			const decl = path.get("declaration")

			// Handle: export default function() {} or export default function Name() {}
			if (decl.isFunctionDeclaration()) {
				if (addTypeToFunction(decl.node, DEFAULT_EXPORT_TYPE)) {
					modified = true
				}
				return
			}

			// Handle: export default () => {} or export default function() {}
			if (decl.isArrowFunctionExpression() || decl.isFunctionExpression()) {
				if (addTypeToFunction(decl.node, DEFAULT_EXPORT_TYPE)) {
					modified = true
				}
				return
			}

			// Handle: export default Component (identifier reference)
			if (decl.isIdentifier()) {
				const binding = path.scope.getBinding(decl.node.name)
				if (binding) {
					declarationsToModify.set(decl.node.name, DEFAULT_EXPORT_TYPE)
				}
			}
		},
	})

	// Second pass: modify local declarations that are re-exported
	if (declarationsToModify.size > 0) {
		trav(ast, {
			FunctionDeclaration(path) {
				const { id } = path.node
				if (!id) return
				const typeName = declarationsToModify.get(id.name)
				if (!typeName) return

				if (addTypeToFunction(path.node, typeName)) {
					modified = true
				}
			},
			VariableDeclarator(path) {
				const id = path.get("id")
				if (!id.isIdentifier()) return

				const typeName = declarationsToModify.get(id.node.name)
				if (!typeName) return

				const init = path.node.init
				if (!init) return

				if (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) {
					if (addTypeToFunction(init, typeName)) {
						modified = true
					}
				}
			},
		})
	}

	// Add Route import if modifications were made and import doesn't exist
	if (modified && !hasRouteImport(ast, importPath)) {
		const routeImport = t.importDeclaration(
			[t.importSpecifier(t.identifier("Route"), t.identifier("Route"))],
			t.stringLiteral(importPath)
		)
		routeImport.importKind = "type"
		ast.program.body.unshift(routeImport)
	}

	return modified
}

/**
 * Extract the filename without extension from a file path
 */
function getFilenameFromPath(filePath: string): string {
	// Normalize path separators
	const normalized = filePath.replace(/\\/g, "/")
	// Get the last segment
	const lastSegment = normalized.split("/").pop() || ""
	// Remove extension
	return lastSegment.replace(/\.(tsx?|jsx?)$/, "")
}

/**
 * Add type annotations to React Router route exports
 * @param code - The source code to transform
 * @param filePath - The file path (used to generate import path)
 * @returns Object with transformed code and whether modifications were made
 */
export function addRouteTypes(code: string, filePath: string): { code: string; modified: boolean } {
	const filename = getFilenameFromPath(filePath)

	try {
		const ast = parse(code, {
			sourceType: "module",
			plugins: ["typescript", "jsx"],
		})

		const modified = transform(ast, filename)

		if (!modified) {
			return { code, modified: false }
		}

		const result = gen(ast, {
			retainLines: true,
			retainFunctionParens: true,
		})

		// Ensure there's a newline after the Route import to prevent formatting issues
		let finalCode = result.code
		const importPattern = /^(import type \{ Route \} from "[^"]+";)(?!\n)/m
		finalCode = finalCode.replace(importPattern, "$1\n")

		return { code: finalCode, modified: true }
	} catch (_e) {
		// If parsing fails (invalid syntax), return unchanged
		return { code, modified: false }
	}
}
