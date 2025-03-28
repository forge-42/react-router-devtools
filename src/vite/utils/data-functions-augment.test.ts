import { augmentDataFetchingFunctions } from "./data-functions-augment"

const removeWhitespace = (str: string) => str.replace(/\s/g, "")

describe("transform", () => {
	describe("loader transformations", () => {
		it("should transform the loader export when it's a function", () => {
			const result = augmentDataFetchingFunctions(
				`
			export function loader() {}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
			export const loader = _withLoaderWrapper(function loader() {}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the loader export when it's a const variable", () => {
			const result = augmentDataFetchingFunctions(
				`
			export const loader = async ({ request }) => { return {};}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
			export const loader = _withLoaderWrapper(async ({ request }) => { return {};}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the loader export when it's a let variable", () => {
			const result = augmentDataFetchingFunctions(
				`
			export let loader = async ({ request }) => { return {};}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
			export let loader = _withLoaderWrapper(async ({ request }) => { return {};}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the loader export when it's a var variable", () => {
			const result = augmentDataFetchingFunctions(
				`
			export var loader = async ({ request }) => { return {};}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
			export var loader = _withLoaderWrapper(async ({ request }) => { return {};}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the loader export when it's re-exported from another file", () => {
			const result = augmentDataFetchingFunctions(
				`
			export { loader } from "./loader.js";
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
      import { loader as _loader } from "./loader.js";
			export const loader = _withLoaderWrapper(_loader, "test");
			export {} from "./loader.js";
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the loader export when it's imported from another file and exported", () => {
			const result = augmentDataFetchingFunctions(
				`
			import {  loader } from "./loader.js";
			export { loader };
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
      import { loader  } from "./loader.js";
			export { loader as _loader };
			export const loader = _withLoaderWrapper(_loader, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the loader export when it's exported via export { loader } and declared within the file", () => {
			const result = augmentDataFetchingFunctions(
				`

			function loader() {
				return { name: 'React Router' };
			}


			export { loader };

			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
      const loader = _withLoaderWrapper(function loader() {
				return { name: 'React Router' };
			}, "test");
			export { loader  };

		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		/* 	it("should work with export { loader } from 'x' pattern", () => {
			const result = augmentDataFetchingFunctions(
				`

		export {  loader } from "./$slug";
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
			import { loader as _loader } from "./$slug";
      const loader = _withLoaderWrapper(_loader, "test");
			export { loader  };

		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		}) */
	})

	describe("clientLoader transformations", () => {
		it("should wrap the client loader export when it's a function", () => {
			const result = augmentDataFetchingFunctions(
				`
				export function clientLoader() {}
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
				export const clientLoader = _withClientLoaderWrapper(function clientLoader() {}, "test");
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the client loader export when it's a const variable", () => {
			const result = augmentDataFetchingFunctions(
				`
				export const clientLoader = async ({ request }) => { return {};}
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
				export const clientLoader = _withClientLoaderWrapper(async ({ request }) => { return {};}, "test");
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the client loader export when it's a let variable", () => {
			const result = augmentDataFetchingFunctions(
				`
				export let clientLoader = async ({ request }) => { return {};}
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
				export let clientLoader = _withClientLoaderWrapper(async ({ request }) => { return {};}, "test");
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the client loader export when it's a var variable", () => {
			const result = augmentDataFetchingFunctions(
				`
				export var clientLoader = async ({ request }) => { return {};}
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
				export var clientLoader = _withClientLoaderWrapper(async ({ request }) => { return {};}, "test");
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the client loader export when it's re-exported from another file", () => {
			const result = augmentDataFetchingFunctions(
				`
				import { clientLoader } from "./client-loader.js";
				export { clientLoader };
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
				import { clientLoader  } from "./client-loader.js";
				export { clientLoader as _clientLoader };
				export const clientLoader = _withClientLoaderWrapper(_clientLoader, "test");
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the client loader export when it's imported from another file and exported", () => {
			const result = augmentDataFetchingFunctions(
				`
				import { clientLoader } from "./client-loader.js";
				export { clientLoader };
				`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
				import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
				import { clientLoader  } from "./client-loader.js";
				export { clientLoader as _clientLoader };
				export const clientLoader = _withClientLoaderWrapper(_clientLoader, "test");
			`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the client action export when it's re-exported from another file", () => {
			const result = augmentDataFetchingFunctions(
				`
			export { clientLoader } from "./clientLoader.js";
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
      import { clientLoader as _clientLoader } from "./clientLoader.js";
			export const clientLoader = _withClientLoaderWrapper(_clientLoader, "test");
			export {} from "./clientLoader.js";
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the clientLoader export when it's exported via export { clientLoader } and declared within the file", () => {
			const result = augmentDataFetchingFunctions(
				`

			function clientLoader() {
				return { name: 'React Router' };
			}


			export { clientLoader };

			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withClientLoaderWrapper as _withClientLoaderWrapper   } from "react-router-devtools/client";
			const clientLoader = _withClientLoaderWrapper(function clientLoader() {
				return { name: 'React Router' };
			}, "test");
			export { clientLoader  };

		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})
	})

	describe("action transformations", () => {
		it("should transform the action export when it's a function", () => {
			const result = augmentDataFetchingFunctions(
				`
			export function action() {}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
			export const action = _withActionWrapper(function action() {}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the action export when it's a const variable", () => {
			const result = augmentDataFetchingFunctions(
				`
			export const action = async ({ request }) => { return {};}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
			export const action = _withActionWrapper(async ({ request }) => { return {};}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the action export when it's a let variable", () => {
			const result = augmentDataFetchingFunctions(
				`
			export let action = async ({ request }) => { return {};}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
			export let action = _withActionWrapper(async ({ request }) => { return {};}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the action export when it's a var variable", () => {
			const result = augmentDataFetchingFunctions(
				`
			export var action = async ({ request }) => { return {};}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
			export var action = _withActionWrapper(async ({ request }) => { return {};}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the action export when it's re-exported from another file", () => {
			const result = augmentDataFetchingFunctions(
				`
			export { action } from "./action.js";
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
      import { action as _action } from "./action.js";
			export const action = _withActionWrapper(_action, "test");
			export {} from "./action.js";
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the action export when it's imported from another file and exported", () => {
			const result = augmentDataFetchingFunctions(
				`
			import {  action } from "./action.js";
			export { action };
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
      import { action  } from "./action.js";
			export { action as _action };
			export const action = _withActionWrapper(_action, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the action export when it's exported via export { action } and declared within the file", () => {
			const result = augmentDataFetchingFunctions(
				`

			function action() {
				return { name: 'React Router' };
			}


			export { action };

			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withActionWrapper as _withActionWrapper   } from "react-router-devtools/server";
      const action = _withActionWrapper(function action() {
				return { name: 'React Router' };
			}, "test");
			export { action  };

		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})
	})
	describe("client action transformations", () => {
		it("should transform the client action export when it's a function", () => {
			const result = augmentDataFetchingFunctions(
				`
			export function clientAction() {}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
			export const clientAction = _withClientActionWrapper(function clientAction() {}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the client action export when it's a const variable", () => {
			const result = augmentDataFetchingFunctions(
				`
			export const clientAction = async ({ request }) => { return {};}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
			export const clientAction = _withClientActionWrapper(async ({ request }) => { return {};}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the client action export when it's a let variable", () => {
			const result = augmentDataFetchingFunctions(
				`
			export let clientAction = async ({ request }) => { return {};}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
			export let clientAction = _withClientActionWrapper(async ({ request }) => { return {};}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the client action export when it's a var variable", () => {
			const result = augmentDataFetchingFunctions(
				`
			export var clientAction = async ({ request }) => { return {};}
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
			export var clientAction = _withClientActionWrapper(async ({ request }) => { return {};}, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the client action export when it's re-exported from another file", () => {
			const result = augmentDataFetchingFunctions(
				`
			import { clientAction } from "./client-action.js";
			export { clientAction };
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
			import { clientAction  } from "./client-action.js";
			export { clientAction as _clientAction };
			export const clientAction = _withClientActionWrapper(_clientAction, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the client action export when it's re-exported from another file", () => {
			const result = augmentDataFetchingFunctions(
				`
			export { clientAction } from "./clientAction.js";
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
      import { clientAction as _clientAction } from "./clientAction.js";
			export const clientAction = _withClientActionWrapper(_clientAction, "test");
			export {} from "./clientAction.js";
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should transform the client action export when it's imported from another file and exported", () => {
			const result = augmentDataFetchingFunctions(
				`
			import { clientAction } from "./client-action.js";
			export { clientAction };
			`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
			import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
      import { clientAction  } from "./client-action.js";
			export { clientAction as _clientAction };
			export const clientAction = _withClientActionWrapper(_clientAction, "test");
		`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})

		it("should wrap the clientAction export when it's exported via export { clientAction } and declared within the file", () => {
			const result = augmentDataFetchingFunctions(
				`

		function clientAction() {
			return { name: 'React Router' };
		}


		export { clientAction };

		`,
				"test",
				"/file/path"
			)
			const expected = removeWhitespace(`
		import { withClientActionWrapper as _withClientActionWrapper   } from "react-router-devtools/client";
		const clientAction = _withClientActionWrapper(function clientAction() {
			return { name: 'React Router' };
		}, "test");
		export { clientAction  };

	`)
			expect(removeWhitespace(result.code)).toStrictEqual(expected)
		})
	})
})

it("should transform the re-exports when it's re-exported from another file with multiple re-exports", () => {
	const result = augmentDataFetchingFunctions(
		`
	export { action, loader, default } from "./action.js";
	`,
		"test",
		"/file/path"
	)
	const expected = removeWhitespace(`
	import { withActionWrapper as _withActionWrapper, withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
	import { action as _action } from "./action.js";
	import { loader as _loader } from "./action.js";
	export const action = _withActionWrapper(_action, "test");
	export const loader = _withLoaderWrapper(_loader, "test");
	export { default } from "./action.js";
`)
	expect(removeWhitespace(result.code)).toStrictEqual(expected)
})

it("should transform the re-exports when it's re-exported from another file with multiple re-exports", () => {
	const result = augmentDataFetchingFunctions(
		`
	export { action, loader, default, blah } from "./action.js";
	`,
		"test",
		"/file/path"
	)
	const expected = removeWhitespace(`
	import { withActionWrapper as _withActionWrapper, withLoaderWrapper as _withLoaderWrapper   } from "react-router-devtools/server";
	import { action as _action } from "./action.js";
	import { loader as _loader } from "./action.js";
	export const action = _withActionWrapper(_action, "test");
	export const loader = _withLoaderWrapper(_loader, "test");
	export { default, blah } from "./action.js";
`)
	expect(removeWhitespace(result.code)).toStrictEqual(expected)
})
