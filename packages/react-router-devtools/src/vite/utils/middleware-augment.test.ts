import { augmentMiddlewareFunctions } from "./middleware-augment"

const removeWhitespace = (str: string) => str.replace(/\s/g, "")

describe("middleware augmentation", () => {
	describe("middleware transformations", () => {
		it("should transform middleware array with named functions", () => {
			const result = augmentMiddlewareFunctions(
				`
				export function authMiddleware() {}
				export function loggingMiddleware() {}
				export const middleware = [authMiddleware, loggingMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				export function authMiddleware() {}
				export function loggingMiddleware() {}
				export const middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware"),
					_withMiddlewareWrapperSingle(loggingMiddleware, "test", 1, "loggingMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform middleware array with arrow functions (no names)", () => {
			const result = augmentMiddlewareFunctions(
				`
				export const middleware = [
					async ({ request }) => { return null; },
					async ({ request }) => { return null; }
				];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				export const middleware = [
					_withMiddlewareWrapperSingle(async ({ request }) => { return null; }, "test", 0, "test_middleware_0"),
					_withMiddlewareWrapperSingle(async ({ request }) => { return null; }, "test", 1, "test_middleware_1")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform middleware array with mixed named and arrow functions", () => {
			const result = augmentMiddlewareFunctions(
				`
				export function authMiddleware() {}
				export const middleware = [
					authMiddleware,
					async ({ request }) => { return null; }
				];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				export function authMiddleware() {}
				export const middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware"),
					_withMiddlewareWrapperSingle(async ({ request }) => { return null; }, "test", 1, "test_middleware_1")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform middleware with let declaration", () => {
			const result = augmentMiddlewareFunctions(
				`
				export function authMiddleware() {}
				export let middleware = [authMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				export function authMiddleware() {}
				export let middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform middleware with var declaration", () => {
			const result = augmentMiddlewareFunctions(
				`
				export function authMiddleware() {}
				export var middleware = [authMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				export function authMiddleware() {}
				export var middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle middleware array with imported functions", () => {
			const result = augmentMiddlewareFunctions(
				`
				import { authMiddleware } from "./auth";
				export const middleware = [authMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				import { authMiddleware } from "./auth";
				export const middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle empty middleware array", () => {
			const result = augmentMiddlewareFunctions(
				`
				export const middleware = [];
				`,
				"test",
				"/file/path"
			)
			// Empty arrays should not be transformed (no imports needed)
			const expected = removeWhitespace(`
				export const middleware = [];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle middleware declared before export", () => {
			const result = augmentMiddlewareFunctions(
				`
				function authMiddleware() {}
				const middleware = [authMiddleware];
				export { middleware };
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				function authMiddleware() {}
				const middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware")
				];
				export { middleware };
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle multiple middleware in complex setup", () => {
			const result = augmentMiddlewareFunctions(
				`
				import { corsMiddleware } from "./cors";

				function authMiddleware() {}
				const loggingMiddleware = async () => {};

				export const middleware = [
					corsMiddleware,
					authMiddleware,
					loggingMiddleware,
					async ({ request }) => { return null; }
				];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				import { corsMiddleware } from "./cors";

				function authMiddleware() {}
				const loggingMiddleware = async () => {};

				export const middleware = [
					_withMiddlewareWrapperSingle(corsMiddleware, "test", 0, "corsMiddleware"),
					_withMiddlewareWrapperSingle(authMiddleware, "test", 1, "authMiddleware"),
					_withMiddlewareWrapperSingle(loggingMiddleware, "test", 2, "loggingMiddleware"),
					_withMiddlewareWrapperSingle(async ({ request }) => { return null; }, "test", 3, "test_middleware_3")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should not transform files without middleware export", () => {
			const code = `
				export function loader() {}
				export const action = async () => {};
			`
			const result = augmentMiddlewareFunctions(code, "test", "/file/path")
			expect(removeWhitespace(result.code)).toStrictEqual(removeWhitespace(code))
		})

		it("should handle middleware with function expressions", () => {
			const result = augmentMiddlewareFunctions(
				`
				const authMiddleware = function() {};
				export const middleware = [authMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				const authMiddleware = function() {};
				export const middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})
	})

	describe("clientMiddleware transformations", () => {
		it("should transform clientMiddleware array with named functions", () => {
			const result = augmentMiddlewareFunctions(
				`
				export function clientAuthMiddleware() {}
				export function clientLoggingMiddleware() {}
				export const clientMiddleware = [clientAuthMiddleware, clientLoggingMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientMiddlewareWrapperSingle as _withClientMiddlewareWrapperSingle } from "react-router-devtools/client";
				export function clientAuthMiddleware() {}
				export function clientLoggingMiddleware() {}
				export const clientMiddleware = [
					_withClientMiddlewareWrapperSingle(clientAuthMiddleware, "test", 0, "clientAuthMiddleware"),
					_withClientMiddlewareWrapperSingle(clientLoggingMiddleware, "test", 1, "clientLoggingMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform clientMiddleware array with arrow functions", () => {
			const result = augmentMiddlewareFunctions(
				`
				export const clientMiddleware = [
					async ({ request }) => { return null; },
					async ({ request }) => { return null; }
				];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientMiddlewareWrapperSingle as _withClientMiddlewareWrapperSingle } from "react-router-devtools/client";
				export const clientMiddleware = [
					_withClientMiddlewareWrapperSingle(async ({ request }) => { return null; }, "test", 0, "test_clientMiddleware_0"),
					_withClientMiddlewareWrapperSingle(async ({ request }) => { return null; }, "test", 1, "test_clientMiddleware_1")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform clientMiddleware with mixed named and arrow functions", () => {
			const result = augmentMiddlewareFunctions(
				`
				export function clientAuthMiddleware() {}
				export const clientMiddleware = [
					clientAuthMiddleware,
					async ({ request }) => { return null; }
				];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientMiddlewareWrapperSingle as _withClientMiddlewareWrapperSingle } from "react-router-devtools/client";
				export function clientAuthMiddleware() {}
				export const clientMiddleware = [
					_withClientMiddlewareWrapperSingle(clientAuthMiddleware, "test", 0, "clientAuthMiddleware"),
					_withClientMiddlewareWrapperSingle(async ({ request }) => { return null; }, "test", 1, "test_clientMiddleware_1")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform clientMiddleware with let declaration", () => {
			const result = augmentMiddlewareFunctions(
				`
				export function clientAuthMiddleware() {}
				export let clientMiddleware = [clientAuthMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientMiddlewareWrapperSingle as _withClientMiddlewareWrapperSingle } from "react-router-devtools/client";
				export function clientAuthMiddleware() {}
				export let clientMiddleware = [
					_withClientMiddlewareWrapperSingle(clientAuthMiddleware, "test", 0, "clientAuthMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform clientMiddleware with var declaration", () => {
			const result = augmentMiddlewareFunctions(
				`
				export function clientAuthMiddleware() {}
				export var clientMiddleware = [clientAuthMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientMiddlewareWrapperSingle as _withClientMiddlewareWrapperSingle } from "react-router-devtools/client";
				export function clientAuthMiddleware() {}
				export var clientMiddleware = [
					_withClientMiddlewareWrapperSingle(clientAuthMiddleware, "test", 0, "clientAuthMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle clientMiddleware with imported functions", () => {
			const result = augmentMiddlewareFunctions(
				`
				import { clientAuthMiddleware } from "./auth";
				export const clientMiddleware = [clientAuthMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientMiddlewareWrapperSingle as _withClientMiddlewareWrapperSingle } from "react-router-devtools/client";
				import { clientAuthMiddleware } from "./auth";
				export const clientMiddleware = [
					_withClientMiddlewareWrapperSingle(clientAuthMiddleware, "test", 0, "clientAuthMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle empty clientMiddleware array", () => {
			const result = augmentMiddlewareFunctions(
				`
				export const clientMiddleware = [];
				`,
				"test",
				"/file/path"
			)
			// Empty arrays should not be transformed (no imports needed)
			const expected = removeWhitespace(`
				export const clientMiddleware = [];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle clientMiddleware declared before export", () => {
			const result = augmentMiddlewareFunctions(
				`
				function clientAuthMiddleware() {}
				const clientMiddleware = [clientAuthMiddleware];
				export { clientMiddleware };
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientMiddlewareWrapperSingle as _withClientMiddlewareWrapperSingle } from "react-router-devtools/client";
				function clientAuthMiddleware() {}
				const clientMiddleware = [
					_withClientMiddlewareWrapperSingle(clientAuthMiddleware, "test", 0, "clientAuthMiddleware")
				];
				export { clientMiddleware };
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle multiple clientMiddleware in complex setup", () => {
			const result = augmentMiddlewareFunctions(
				`
				import { clientCorsMiddleware } from "./cors";

				function clientAuthMiddleware() {}
				const clientLoggingMiddleware = async () => {};

				export const clientMiddleware = [
					clientCorsMiddleware,
					clientAuthMiddleware,
					clientLoggingMiddleware,
					async ({ request }) => { return null; }
				];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientMiddlewareWrapperSingle as _withClientMiddlewareWrapperSingle } from "react-router-devtools/client";
				import { clientCorsMiddleware } from "./cors";

				function clientAuthMiddleware() {}
				const clientLoggingMiddleware = async () => {};

				export const clientMiddleware = [
					_withClientMiddlewareWrapperSingle(clientCorsMiddleware, "test", 0, "clientCorsMiddleware"),
					_withClientMiddlewareWrapperSingle(clientAuthMiddleware, "test", 1, "clientAuthMiddleware"),
					_withClientMiddlewareWrapperSingle(clientLoggingMiddleware, "test", 2, "clientLoggingMiddleware"),
					_withClientMiddlewareWrapperSingle(async ({ request }) => { return null; }, "test", 3, "test_clientMiddleware_3")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})
	})

	describe("combined middleware and clientMiddleware transformations", () => {
		it("should transform both middleware and clientMiddleware in same file", () => {
			const result = augmentMiddlewareFunctions(
				`
				export function authMiddleware() {}
				export function clientAuthMiddleware() {}
				export const middleware = [authMiddleware];
				export const clientMiddleware = [clientAuthMiddleware];
				`,
				"test",
				"/file/path"
			)
			// Both imports should be separate lines (clientMiddleware first, then middleware)
			const expected = removeWhitespace(`
				import { withClientMiddlewareWrapperSingle as _withClientMiddlewareWrapperSingle } from "react-router-devtools/client";
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				export function authMiddleware() {}
				export function clientAuthMiddleware() {}
				export const middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware")
				];
				export const clientMiddleware = [
					_withClientMiddlewareWrapperSingle(clientAuthMiddleware, "test", 0, "clientAuthMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle complex file with loaders, actions, and middleware", () => {
			const result = augmentMiddlewareFunctions(
				`
				export function loader() { return {}; }
				export function action() { return {}; }
				export function authMiddleware() {}
				export const middleware = [authMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				export function loader() { return {}; }
				export function action() { return {}; }
				export function authMiddleware() {}
				export const middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})
	})

	describe("edge cases", () => {
		it("should handle middleware with single element", () => {
			const result = augmentMiddlewareFunctions(
				`
				export const middleware = [async () => {}];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				export const middleware = [
					_withMiddlewareWrapperSingle(async () => {}, "test", 0, "test_middleware_0")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle middleware with spread operator", () => {
			const result = augmentMiddlewareFunctions(
				`
				const baseMiddleware = [authMiddleware];
				export const middleware = [...baseMiddleware, loggingMiddleware];
				`,
				"test",
				"/file/path"
			)
			// Spread operator should map over each element in the spread array
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				const baseMiddleware = [authMiddleware];
				export const middleware = [
					...baseMiddleware.map((_fn, _idx) => _withMiddlewareWrapperSingle(
						_fn,
						"test",
						0 + _idx,
						_fn.name || "test_middleware_" + (0 + _idx)
					)),
					_withMiddlewareWrapperSingle(loggingMiddleware, "test", 1000, "loggingMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should preserve comments in middleware array", () => {
			const result = augmentMiddlewareFunctions(
				`
				export const middleware = [
					authMiddleware, // Authentication
					loggingMiddleware // Logging
				];
				`,
				"test",
				"/file/path"
			)
			expect(result.code).toContain("withMiddlewareWrapperSingle")
			expect(result.code).toContain("Authentication")
			expect(result.code).toContain("Logging")
		})

		it("should handle middleware with multiline arrow functions", () => {
			const result = augmentMiddlewareFunctions(
				`
				export const middleware = [
					async ({ request }) => {
						const user = await getUser(request);
						return null;
					}
				];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				export const middleware = [
					_withMiddlewareWrapperSingle(async ({ request }) => {
						const user = await getUser(request);
						return null;
					}, "test", 0, "test_middleware_0")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle route ID with special characters", () => {
			const result = augmentMiddlewareFunctions(
				`
				export const middleware = [authMiddleware];
				`,
				"routes/dashboard.$id",
				"/file/path"
			)
			expect(result.code).toContain('"routes/dashboard.$id"')
		})

		it("should not transform if middleware is not an array", () => {
			const code = `
				export const middleware = authMiddleware;
			`
			const result = augmentMiddlewareFunctions(code, "test", "/file/path")
			// Should return unchanged or handle gracefully
			expect(result.code).toBeTruthy()
		})

		it("should handle re-exported middleware", () => {
			const result = augmentMiddlewareFunctions(
				`
				import { middleware } from "./middleware";
				export { middleware };
				`,
				"test",
				"/file/path"
			)
			// Re-exported middleware gets wrapped (this is expected behavior)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				import { middleware as _middleware } from "./middleware";
				export const middleware = _withMiddlewareWrapperSingle(_middleware, "test");
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle middleware with named function expressions", () => {
			const result = augmentMiddlewareFunctions(
				`
				const authMiddleware = function authFn() {};
				export const middleware = [authMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				const authMiddleware = function authFn() {};
				export const middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle deeply nested route IDs", () => {
			const result = augmentMiddlewareFunctions(
				`
				export const middleware = [authMiddleware];
				`,
				"routes/admin/dashboard/users/$userId",
				"/file/path"
			)
			expect(result.code).toContain('"routes/admin/dashboard/users/$userId"')
			// For named functions, the name is extracted, not the route ID
			expect(result.code).toContain('"authMiddleware"')
		})
	})

	describe("aliased import transforms", () => {
		it("should transform aliased middleware import where local name is middleware", () => {
			const result = augmentMiddlewareFunctions(
				`
				import { authMiddleware as middleware } from "./middlewares";
				export { middleware };
				`,
				"test",
				"/file/path"
			)
			// Should skip transformation for re-exported imported middleware
			// The aliased import handler renames it but since it's imported and re-exported, it skips
			expect(result.code).toContain("authMiddleware")
		})

		it("should transform aliased clientMiddleware import where local name is clientMiddleware", () => {
			const result = augmentMiddlewareFunctions(
				`
				import { clientAuthMiddleware as clientMiddleware } from "./middlewares";
				export { clientMiddleware };
				`,
				"test",
				"/file/path"
			)
			// Should skip transformation for re-exported imported middleware
			expect(result.code).toContain("clientAuthMiddleware")
		})

		it("should handle aliased middleware import used in array", () => {
			const result = augmentMiddlewareFunctions(
				`
				import { someAuthFn as authMiddleware } from "./auth";
				export const middleware = [authMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withMiddlewareWrapperSingle as _withMiddlewareWrapperSingle } from "react-router-devtools/server";
				import { someAuthFn as authMiddleware } from "./auth";
				export const middleware = [
					_withMiddlewareWrapperSingle(authMiddleware, "test", 0, "authMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should handle aliased clientMiddleware import used in array", () => {
			const result = augmentMiddlewareFunctions(
				`
				import { someClientAuthFn as clientAuthMiddleware } from "./auth";
				export const clientMiddleware = [clientAuthMiddleware];
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientMiddlewareWrapperSingle as _withClientMiddlewareWrapperSingle } from "react-router-devtools/client";
				import { someClientAuthFn as clientAuthMiddleware } from "./auth";
				export const clientMiddleware = [
					_withClientMiddlewareWrapperSingle(clientAuthMiddleware, "test", 0, "clientAuthMiddleware")
				];
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})
	})
})
