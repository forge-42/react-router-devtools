import type { EntryContext } from "react-router"
type EntryRoute = EntryContext["manifest"]["routes"][0]
type RouteManifest = EntryContext["manifest"]["routes"]
type Route = any
/**
 * Helper method used to convert react router route conventions to url segments
 * @param chunk Chunk to convert
 * @returns Returns the converted chunk
 */
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
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
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
	} catch (e) {
		return undefined
	}
}

interface RawNodeDatum {
	name: string
	attributes?: Record<string, string | number | boolean>
	children?: RawNodeDatum[]
	errorBoundary: { hasErrorBoundary: boolean; errorBoundaryId: string | null }
}

const constructTree = (routes: any, parentId?: string): RawNodeDatum[] => {
	const nodes: RawNodeDatum[] = []
	const routeKeys = Object.keys(routes)
	for (const key of routeKeys) {
		const route = routes[key]
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log({
			key,
			route,
			parentId,
		})
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
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log("createRouteTree", routes)
	return constructTree(routes)
}

export const uppercaseFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}
