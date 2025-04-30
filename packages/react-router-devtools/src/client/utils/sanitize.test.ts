import { convertReactRouterPathToUrl } from "./sanitize.js"

describe("convertReactRouterPathToUrl", () => {
	it('should return "/" when given a route with no parent', () => {
		const routes = {
			root: {
				id: "root",
				path: "",
				hasErrorBoundary: false,
			},
		}

		const route = routes.root
		const result = convertReactRouterPathToUrl(routes as any, route)
		expect(result).toBe("/")
	})

	it("should return the correct URL for a nested route", () => {
		const routes = {
			root: {
				id: "root",
				path: "",
				hasErrorBoundary: false,
			},
			parentRoute: {
				id: "parentRoute",
				parentId: "root",
				path: "parent",
				hasErrorBoundary: false,
			},
			childRoute: {
				id: "childRoute",
				parentId: "parentRoute",
				path: "child",
				hasErrorBoundary: false,
			},
		}

		const route = routes.childRoute
		const result = convertReactRouterPathToUrl(routes, route)
		expect(result).toBe("parent/child")
	})

	it("should return the correct URL for a route with a parent that does not exist in the routes object", () => {
		const routes = {
			root: {
				id: "root",
				path: "",
				hasErrorBoundary: false,
			},
			childRoute: {
				id: "childRoute",
				parentId: "nonExistentParent",
				path: "child",
				hasErrorBoundary: false,
			},
		}

		const route = routes.childRoute
		const result = convertReactRouterPathToUrl(routes, route)
		expect(result).toBe("child")
	})

	it("should return the correct URL for a route with a parent that has an empty path", () => {
		const routes = {
			root: {
				id: "root",
				path: "",
				hasErrorBoundary: false,
			},
			parentRoute: {
				id: "parentRoute",
				parentId: "root",
				path: "",
				hasErrorBoundary: false,
			},
			childRoute: {
				id: "childRoute",
				parentId: "parentRoute",
				path: "child",
				hasErrorBoundary: false,
			},
		}

		const route = routes.childRoute
		const result = convertReactRouterPathToUrl(routes, route)
		expect(result).toBe("child")
	})
})
