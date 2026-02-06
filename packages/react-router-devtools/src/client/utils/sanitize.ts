import type { EntryContext } from "react-router"
type RouteManifest = EntryContext["manifest"]["routes"]
// biome-ignore lint/suspicious/noExplicitAny: we don't know the type
type Route = any
/**
 * Helper method used to convert react router route conventions to url segments
 * @param chunk Chunk to convert
 * @returns Returns the converted chunk
 */

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
export const convertReactRouterPathToUrl = (routes: any, route: Route) => {
	let currentRoute: Route | null = route
	const path = []

	while (currentRoute) {
		path.push(currentRoute.path)
		if (!currentRoute.parentId) break
		if (!routes[currentRoute.parentId]) break
		currentRoute = routes[currentRoute.parentId]
	}
	const output = path.reverse().filter(Boolean).join("/")
	return output === "" ? "/" : output
}

export const findParentErrorBoundary = (route: Route) => {
	// biome-ignore lint/style/noNonNullAssertion: we know it's there
	const routes = window.__reactRouterManifest?.routes!
	let currentRoute: Route | null = route

	while (currentRoute) {
		const hasErrorBoundary = currentRoute.hasErrorBoundary
		if (hasErrorBoundary) return { hasErrorBoundary, errorBoundaryId: currentRoute.id }

		if (!currentRoute.parentId) break
		if (!routes[currentRoute.parentId]) break
		currentRoute = routes[currentRoute.parentId]
	}
	return { hasErrorBoundary: false, errorBoundaryId: null }
}

export const tryParseJson = <T>(json: string | null): T | undefined => {
	if (!json) return undefined
	try {
		return JSON.parse(json)
	} catch (_e) {
		return undefined
	}
}

interface RawNodeDatum {
	name: string
	attributes?: Record<string, string | number | boolean>
	children?: RawNodeDatum[]
	errorBoundary: { hasErrorBoundary: boolean; errorBoundaryId: string | null }
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
const constructTree = (routes: any, parentId?: string): RawNodeDatum[] => {
	const nodes: RawNodeDatum[] = []
	const routeKeys = Object.keys(routes)
	for (const key of routeKeys) {
		const route = routes[key]

		if (route.parentId === parentId) {
			const url = convertReactRouterPathToUrl(routes, route)
			const node: RawNodeDatum = {
				name: url,
				attributes: {
					...route,
					url,
				},
				errorBoundary: findParentErrorBoundary(route),
				children: constructTree(routes, route.id),
			}

			nodes.push(node)
		}
	}

	return nodes
}

export const createRouteTree = (routes: RouteManifest | undefined) => {
	return constructTree(routes)
}
