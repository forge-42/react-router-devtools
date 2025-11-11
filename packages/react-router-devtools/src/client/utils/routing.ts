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

export const createExtendedRoutes = (routes?: Record<string, EntryRoute>) => {
	const manifestRoutes = routes ?? window.__reactRouterManifest?.routes
	if (!manifestRoutes) {
		return []
	}
	return (
		Object.values(manifestRoutes)
			.map((route) => {
				return {
					...route,
					url: convertReactRouterPathToUrl(manifestRoutes, route),
					errorBoundary: findParentErrorBoundary(route),
				}
			})
			// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
			.filter((route) => isLeafRoute(route as any))
	)
}

/**
 * Converts a route module path to a clean route identifier
 * Example: "/app/routes/admin/users.tsx" => "routes/admin/users"
 * Example: "src/routes/admin/users.tsx" => "routes/admin/users"
 * @param modulePath - The module path from the route manifest
 * @returns The cleaned route identifier without the first directory segment and file extension
 */
export const getRouteIdFromModule = (modulePath: string): string => {
	// Remove file extension
	const withoutExtension = modulePath.split(".").slice(0, -1).join(".")
	// Split by "/" and remove the first segment (e.g., "app", "src", etc.)
	const segments = withoutExtension.split("/").filter(Boolean) // filter(Boolean) removes empty strings from leading "/"
	return segments.slice(1).join("/")
}
