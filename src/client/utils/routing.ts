import type { EntryContext } from "react-router"
import type { RouteWildcards } from "../context/rdtReducer.js"
import { convertRemixPathToUrl, findParentErrorBoundary } from "./sanitize.js"
type EntryRoute = EntryContext["manifest"]["routes"][0]
type Route = Pick<EntryRoute, "id" | "index" | "path" | "parentId">

export function getRouteType(route: Route) {
	if (route.id === "root") {
		return "ROOT"
	}
	if (route.index) {
		return "ROUTE"
	}
	if (!route.path) {
		// Pathless layout route
		return "LAYOUT"
	}

	if (!window.__reactRouterManifest) {
		return "ROUTE"
	}
	// Find an index route with parentId set to this route
	const childIndexRoute = Object.values(window.__reactRouterManifest.routes).find(
		(r) => r.parentId === route.id && r.index
	)

	return childIndexRoute ? "LAYOUT" : "ROUTE"
}

export function isLayoutRoute(route: Route | undefined) {
	if (!route) {
		return false
	}
	return getRouteType(route) === "LAYOUT"
}

export function isLeafRoute(route: Route) {
	return getRouteType(route) === "ROUTE"
}

const ROUTE_FILLS = {
	GREEN: "fill-green-500 text-white",
	BLUE: "fill-blue-500 text-white",
	PURPLE: "fill-purple-500 text-white",
} as const

export function getRouteColor(route: Route) {
	switch (getRouteType(route)) {
		case "ROOT":
			return ROUTE_FILLS.PURPLE
		case "LAYOUT":
			return ROUTE_FILLS.BLUE
		case "ROUTE":
			return ROUTE_FILLS.GREEN
	}
}
export type ExtendedRoute = EntryRoute & {
	url: string
	errorBoundary: { hasErrorBoundary: boolean; errorBoundaryId: string | null }
}

export const constructRoutePath = (route: ExtendedRoute, routeWildcards: RouteWildcards) => {
	const hasWildcard = route.url.includes(":")
	const wildcards = routeWildcards[route.id]
	const path = route.url
		.split("/")
		.map((p) => {
			if (p.startsWith(":")) {
				return wildcards?.[p] ? wildcards?.[p] : p
			}
			return p
		})
		.join("/")
	const pathToOpen = document.location.origin + (path === "/" ? path : `/${path}`)
	return { pathToOpen, path, hasWildcard }
}

export const createExtendedRoutes = () => {
	if (!window.__reactRouterManifest) {
		return []
	}
	return Object.values(window.__reactRouterManifest.routes)
		.map((route) => {
			return {
				...route,
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				url: convertRemixPathToUrl(window.__reactRouterManifest!.routes, route),
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				errorBoundary: findParentErrorBoundary(window.__reactRouterManifest!.routes, route),
			}
		})
		.filter((route) => isLeafRoute(route))
}
