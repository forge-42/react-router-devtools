import type { EntryContext } from "react-router"
import type { RouteWildcards } from "../context/rdtReducer.js"
import { convertReactRouterPathToUrl, findParentErrorBoundary } from "./sanitize.js"
type EntryRoute = EntryContext["manifest"]["routes"][0]
type Route = Pick<NonNullable<EntryRoute>, "id" | "index" | "path" | "parentId">
declare global {
	interface Window {
		__reactRouterManifest?: EntryContext["manifest"]
	}
}
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
		(r) => r?.parentId === route.id && r.index
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

const UNDISCOVERED_ROUTE_FILLS = {
	GREEN: "fill-green-500/20 text-white",
	BLUE: "fill-blue-500/20 text-white",
	PURPLE: "fill-purple-500/20 text-white",
}

export function getRouteColor(route: Route) {
	const isDiscovered = !!window.__reactRouterManifest?.routes[route.id]
	const FILL = isDiscovered ? ROUTE_FILLS : UNDISCOVERED_ROUTE_FILLS
	switch (getRouteType(route)) {
		case "ROOT":
			return FILL.PURPLE

		case "ROUTE":
			return FILL.GREEN

		case "LAYOUT":
			return FILL.BLUE
	}
}
export type ExtendedRoute = EntryRoute & {
	url: string
	file?: string
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
				url: convertReactRouterPathToUrl(window.__reactRouterManifest!.routes, route),
				errorBoundary: findParentErrorBoundary(route),
			}
		})
		.filter((route) => isLeafRoute(route as any))
}
