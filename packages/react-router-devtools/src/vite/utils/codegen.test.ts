import { addRouteTypes } from "./codegen"

const removeWhitespace = (str: string) => str.replace(/\s/g, "")

// Normalize code for comparison - removes whitespace and handles trailing semicolons
const normalize = (str: string) => removeWhitespace(str).replace(/;}/g, "}").replace(/;$/g, "")

describe("codegen", () => {
	describe("loader transformations", () => {
		it("should skip loader function declaration with no params", () => {
			const result = addRouteTypes("export function loader() {}", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to loader function declaration with untyped destructured param", () => {
			const result = addRouteTypes("export function loader({ request }) {}", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export function loader({ request }: Route.LoaderArgs) {}
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip loader arrow function with no params", () => {
			const result = addRouteTypes("export const loader = () => {}", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to loader arrow function with untyped destructured param", () => {
			const result = addRouteTypes("export const loader = ({ request }) => {}", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export const loader = ({ request }: Route.LoaderArgs) => {};
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip async loader function with no params", () => {
			const result = addRouteTypes("export async function loader() { return {}; }", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to async loader arrow function with destructured param", () => {
			const result = addRouteTypes(
				"export const loader = async ({ request }) => { return {}; }",
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				export const loader = async ({ request }: Route.LoaderArgs) => { return {}; };
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip loader with existing type annotation", () => {
			const result = addRouteTypes(
				`import type { Route } from "./+types/home";
				export function loader({ request }: Route.LoaderArgs) {}`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should skip loader with multiple params", () => {
			const result = addRouteTypes("export function loader(arg1, arg2) {}", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to loader with plain identifier param (args)", () => {
			const result = addRouteTypes("export function loader(args) {}", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export function loader(args: Route.LoaderArgs) {}
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should add type to loader with empty object destructuring", () => {
			const result = addRouteTypes("export function loader({}) {}", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export function loader({}: Route.LoaderArgs) {}
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip loader let variable with no params", () => {
			const result = addRouteTypes("export let loader = () => {}", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should skip loader var variable with no params", () => {
			const result = addRouteTypes("export var loader = () => {}", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})
	})

	describe("action transformations", () => {
		it("should skip action function declaration with no params", () => {
			const result = addRouteTypes("export function action() {}", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to action arrow function with destructured param", () => {
			const result = addRouteTypes("export const action = ({ request }) => {}", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export const action = ({ request }: Route.ActionArgs) => {};
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip action with existing type annotation", () => {
			const result = addRouteTypes(
				`import type { Route } from "./+types/home";
				export function action({ request }: Route.ActionArgs) {}`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})
	})

	describe("clientLoader transformations", () => {
		it("should skip clientLoader function declaration with no params", () => {
			const result = addRouteTypes("export function clientLoader() {}", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to clientLoader arrow function with destructured param", () => {
			const result = addRouteTypes("export const clientLoader = ({ serverLoader }) => {}", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export const clientLoader = ({ serverLoader }: Route.ClientLoaderArgs) => {};
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})
	})

	describe("clientAction transformations", () => {
		it("should skip clientAction function declaration with no params", () => {
			const result = addRouteTypes("export function clientAction() {}", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to clientAction arrow function with destructured param", () => {
			const result = addRouteTypes("export const clientAction = ({ serverAction }) => {}", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export const clientAction = ({ serverAction }: Route.ClientActionArgs) => {};
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})
	})

	describe("meta transformations", () => {
		it("should skip meta function declaration with no params", () => {
			const result = addRouteTypes("export function meta() { return []; }", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to meta arrow function with destructured param", () => {
			const result = addRouteTypes("export const meta = ({ data }) => { return []; }", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export const meta = ({ data }: Route.MetaArgs) => { return []; };
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})
	})

	describe("links transformations", () => {
		it("should skip links function declaration with no params", () => {
			const result = addRouteTypes("export function links() { return []; }", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should skip links arrow function with no params", () => {
			const result = addRouteTypes("export const links = () => { return []; }", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})
	})

	describe("headers transformations", () => {
		it("should skip headers function declaration with no params", () => {
			const result = addRouteTypes("export function headers() { return {}; }", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to headers arrow function with destructured param", () => {
			const result = addRouteTypes(
				"export const headers = ({ loaderHeaders }) => { return {}; }",
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				export const headers = ({ loaderHeaders }: Route.HeadersArgs) => { return {}; };
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})
	})

	describe("middleware transformations", () => {
		it("should add type to middleware array export", () => {
			const result = addRouteTypes("export const middleware = [];", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export const middleware: Route.MiddlewareFunction[] = [];
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should add type to middleware array with content", () => {
			const result = addRouteTypes("export const middleware = [someMiddleware];", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export const middleware: Route.MiddlewareFunction[] = [someMiddleware];
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip middleware with existing type annotation", () => {
			const result = addRouteTypes(
				`import type { Route } from "./+types/home";
				export const middleware: Route.MiddlewareFunction[] = [];`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})
	})

	describe("clientMiddleware transformations", () => {
		it("should add type to clientMiddleware array export", () => {
			const result = addRouteTypes("export const clientMiddleware = [];", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export const clientMiddleware: Route.ClientMiddlewareFunction[] = [];
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip clientMiddleware with existing type annotation", () => {
			const result = addRouteTypes(
				`import type { Route } from "./+types/home";
				export const clientMiddleware: Route.ClientMiddlewareFunction[] = [];`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})
	})

	describe("ErrorBoundary transformations", () => {
		it("should skip ErrorBoundary function declaration with no params", () => {
			const result = addRouteTypes(
				"export function ErrorBoundary() { return <div>Error</div>; }",
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should add type to ErrorBoundary arrow function with destructured param", () => {
			const result = addRouteTypes(
				"export const ErrorBoundary = ({ error }) => { return <div>Error</div>; }",
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => { return <div>Error</div>; };
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip ErrorBoundary with existing type annotation", () => {
			const result = addRouteTypes(
				`import type { Route } from "./+types/home";
				export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) { return <div>Error</div>; }`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})
	})

	describe("HydrateFallback transformations", () => {
		it("should skip HydrateFallback function declaration with no params", () => {
			const result = addRouteTypes(
				"export function HydrateFallback() { return <div>Loading...</div>; }",
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should skip HydrateFallback arrow function with no params", () => {
			const result = addRouteTypes(
				"export const HydrateFallback = () => { return <div>Loading...</div>; }",
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})
	})

	describe("default export (component) transformations", () => {
		it("should skip default export function declaration with no params", () => {
			const result = addRouteTypes("export default function Home() { return <div>Home</div>; }", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to default export function declaration with untyped destructured param", () => {
			const result = addRouteTypes(
				"export default function Home({ loaderData }) { return <div>Home</div>; }",
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				export default function Home({ loaderData }: Route.ComponentProps) { return <div>Home</div>; }
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip anonymous default export function with no params", () => {
			const result = addRouteTypes("export default function() { return <div>Home</div>; }", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should skip default export arrow function with no params", () => {
			const result = addRouteTypes("export default () => { return <div>Home</div>; }", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to default export arrow function with untyped destructured param", () => {
			const result = addRouteTypes(
				"export default ({ loaderData }) => { return <div>Home</div>; }",
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				export default ({ loaderData }: Route.ComponentProps) => { return <div>Home</div>; };
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip default export with existing type annotation", () => {
			const result = addRouteTypes(
				`import type { Route } from "./+types/home";
				export default function Home({ loaderData }: Route.ComponentProps) { return <div>Home</div>; }`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should skip re-exported component as default with no params", () => {
			const result = addRouteTypes(
				`function Component() { return <div>Home</div>; }
				export { Component as default }`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should skip variable component exported as default with no params", () => {
			const result = addRouteTypes(
				`const Component = () => { return <div>Home</div>; }
				export { Component as default }`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should add type to re-exported component as default with destructured param", () => {
			const result = addRouteTypes(
				`function Component({ loaderData }) { return <div>Home</div>; }
				export { Component as default }`,
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				function Component({ loaderData }: Route.ComponentProps) { return <div>Home</div>; }
				export { Component as default };
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip identifier default export with no params", () => {
			const result = addRouteTypes(
				`function Home() { return <div>Home</div>; }
				export default Home`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should add type to identifier default export with destructured param", () => {
			const result = addRouteTypes(
				`function Home({ loaderData }) { return <div>Home</div>; }
				export default Home`,
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				function Home({ loaderData }: Route.ComponentProps) { return <div>Home</div>; }
				export default Home;
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip default export with multiple params", () => {
			const result = addRouteTypes(
				"export default function Home(props, context) { return <div>Home</div>; }",
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})
	})

	describe("re-export patterns", () => {
		it("should skip function declared in file and exported via export { loader } with no params", () => {
			const result = addRouteTypes(
				`function loader() { return {}; }
				export { loader }`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should add type to function declared in file and exported via export { loader } with destructured param", () => {
			const result = addRouteTypes(
				`function loader({ request }) { return {}; }
				export { loader }`,
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				function loader({ request }: Route.LoaderArgs) { return {}; }
				export { loader };
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip variable declared in file and exported via export { action } with no params", () => {
			const result = addRouteTypes(
				`const action = () => { return {}; }
				export { action }`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should add type to variable declared in file and exported via export { action } with destructured param", () => {
			const result = addRouteTypes(
				`const action = ({ request }) => { return {}; }
				export { action }`,
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				const action = ({ request }: Route.ActionArgs) => { return {}; };
				export { action };
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip re-exports from other files", () => {
			const result = addRouteTypes(`export { loader } from "./loader.js"`, "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})
	})

	describe("mixed exports", () => {
		it("should add types to multiple exports in same file with destructured params", () => {
			const result = addRouteTypes(
				`export function loader({ request }) { return {}; }
				export function action({ request }) { return {}; }
				export default function Home({ loaderData }) { return <div>Home</div>; }`,
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				export function loader({ request }: Route.LoaderArgs) { return {}; }
				export function action({ request }: Route.ActionArgs) { return {}; }
				export default function Home({ loaderData }: Route.ComponentProps) { return <div>Home</div>; }
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip all exports when none have destructured params", () => {
			const result = addRouteTypes(
				`export function loader() { return {}; }
				export function action() { return {}; }
				export default function Home() { return <div>Home</div>; }`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should only add types to untyped destructured exports in mixed file", () => {
			const result = addRouteTypes(
				`import type { Route } from "./+types/home";
				export function loader({ request }: Route.LoaderArgs) { return {}; }
				export function action({ request }) { return {}; }`,
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				export function loader({ request }: Route.LoaderArgs) { return {}; }
				export function action({ request }: Route.ActionArgs) { return {}; }
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should not add duplicate import when Route import already exists", () => {
			const result = addRouteTypes(
				`import type { Route } from "./+types/home";
				export function loader({ request }) { return {}; }`,
				"/app/routes/home.tsx"
			)
			// Should only have one import statement
			expect(result.code.match(/import type \{ Route \}/g)?.length).toBe(1)
			expect(result.modified).toBe(true)
		})
	})

	describe("edge cases", () => {
		it("should return unchanged code for invalid syntax", () => {
			const result = addRouteTypes(
				"export function loader( { return {}; }", // Missing closing paren
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should return unchanged code for file with no route exports", () => {
			const result = addRouteTypes(
				`export function helper() { return {}; }
				export const utils = { foo: 'bar' };`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should handle file path with backslashes (Windows)", () => {
			const result = addRouteTypes("export function loader({ request }) { return {}; }", "C:\\app\\routes\\home.tsx")
			expect(result.code).toContain("./+types/home")
			expect(result.modified).toBe(true)
		})

		it("should handle file path with .ts extension", () => {
			const result = addRouteTypes("export function loader({ request }) { return {}; }", "/app/routes/home.ts")
			expect(result.code).toContain("./+types/home")
			expect(result.modified).toBe(true)
		})

		it("should handle file path with .jsx extension", () => {
			const result = addRouteTypes("export function loader({ request }) { return {}; }", "/app/routes/home.jsx")
			expect(result.code).toContain("./+types/home")
			expect(result.modified).toBe(true)
		})

		it("should handle file path with .js extension", () => {
			const result = addRouteTypes("export function loader({ request }) { return {}; }", "/app/routes/home.js")
			expect(result.code).toContain("./+types/home")
			expect(result.modified).toBe(true)
		})

		it("should handle complex file names with dots", () => {
			const result = addRouteTypes("export function loader({ request }) { return {}; }", "/app/routes/$id.edit.tsx")
			expect(result.code).toContain("./+types/$id.edit")
			expect(result.modified).toBe(true)
		})

		it("should handle nested route paths", () => {
			const result = addRouteTypes("export function loader({ request }) { return {}; }", "/app/routes/admin/users.tsx")
			expect(result.code).toContain("./+types/users")
			expect(result.modified).toBe(true)
		})

		it("should not modify non-route exports even with similar names", () => {
			const result = addRouteTypes(
				`export function myLoader() { return {}; }
				export function actionHelper() { return {}; }`,
				"/app/routes/home.tsx"
			)
			expect(result.modified).toBe(false)
		})

		it("should skip function expression in variable with no params", () => {
			const result = addRouteTypes("export const loader = function() { return {}; }", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to function expression in variable with destructured param", () => {
			const result = addRouteTypes("export const loader = function({ request }) { return {}; }", "/app/routes/home.tsx")
			const expected = `
				import type { Route } from "./+types/home";
				export const loader = function({ request }: Route.LoaderArgs) { return {}; };
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})

		it("should skip function expression with name in variable with no params", () => {
			const result = addRouteTypes("export const loader = function myLoader() { return {}; }", "/app/routes/home.tsx")
			expect(result.modified).toBe(false)
		})

		it("should add type to function expression with name in variable with destructured param", () => {
			const result = addRouteTypes(
				"export const loader = function myLoader({ request }) { return {}; }",
				"/app/routes/home.tsx"
			)
			const expected = `
				import type { Route } from "./+types/home";
				export const loader = function myLoader({ request }: Route.LoaderArgs) { return {}; };
			`
			expect(normalize(result.code)).toStrictEqual(normalize(expected))
			expect(result.modified).toBe(true)
		})
	})
})
