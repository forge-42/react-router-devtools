import type { EntryContext } from "react-router"
import { getRouteType, isLayoutRoute, isLeafRoute } from "./routing.js"
// Mock the window.__reactRouterManifest.routes object for testing purposes
const mockRoutes = {
	root: {
		id: "root",
	},
	routeWithIndex: {
		id: "routeWithIndex",
		index: true,
	},
	pathlessLayoutRoute: {
		id: "layoutRoute",
		parentId: "root",
	},
	pathLayoutRoute: {
		id: "layoutRoute",
		parentId: "root",

		path: "path",
	},
	nonIndexRoute: {
		id: "nonIndexRoute",
		parentId: "layoutRoute",
		path: "path",
		index: true,
	},
	nonIndexRouteWithoutALayout: {
		id: "nonIndexRoute",
		path: "path",
	},
}
declare global {
	interface Window {
		__reactRouterManifest?: EntryContext["manifest"]
	}
}
window.__reactRouterManifest = {
	routes: mockRoutes,
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
} as any

describe("getRouteType", () => {
	it('should return "ROOT" when route.id is "root"', () => {
		const route = mockRoutes.root
		const result = getRouteType(route)
		expect(result).toBe("ROOT")
	})

	it('should return "ROUTE" when route has index property', () => {
		const route = mockRoutes.routeWithIndex
		const result = getRouteType(route)
		expect(result).toBe("ROUTE")
	})

	it('should return "LAYOUT" when route has no path', () => {
		const route = { id: "someId" } // Mocking a route without a path
		const result = getRouteType(route)
		expect(result).toBe("LAYOUT")
	})

	it('should return "LAYOUT" when a child index route exists with parentId set to route.id', () => {
		const route = mockRoutes.pathLayoutRoute
		const result = getRouteType(route)
		expect(result).toBe("LAYOUT")
	})

	it('should return "ROUTE" when a child index route does not exist with parentId set to route.id', () => {
		const route = mockRoutes.nonIndexRoute
		const result = getRouteType(route)
		expect(result).toBe("ROUTE")
	})

	it('should return "ROUTE" when a leaf route with a parent layout can not be found', () => {
		const route = mockRoutes.nonIndexRouteWithoutALayout
		const result = getRouteType(route)
		expect(result).toBe("ROUTE")
	})
})

describe("isLayoutRoute Test suite", () => {
	it("should return true for a layout route", () => {
		const route = mockRoutes.pathlessLayoutRoute
		const result = isLayoutRoute(route)
		expect(result).toBe(true)
	})

	it("should not return true for a route that is not a layout", () => {
		const route = mockRoutes.nonIndexRoute
		const result = isLayoutRoute(route)
		expect(result).toBe(false)
	})
})

describe("isLeafRoute Test suite", () => {
	it("should return true for a 'ROUTE' route", () => {
		const route = mockRoutes.nonIndexRoute
		const result = isLeafRoute(route)
		expect(result).toBe(true)
	})

	it("should not return true for a route that is not of type 'ROUTE'", () => {
		const route = mockRoutes.pathLayoutRoute
		const result = isLeafRoute(route)
		expect(result).toBe(false)
	})
})
