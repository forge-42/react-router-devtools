import { injectRdtClient } from "./inject-client"

const removeWhitespace = (str: string) => str.replace(/\s/g, "")

describe("transform", () => {
	it("should transform the default export and inject the rdtStylesheet if there is no links export", () => {
		const result = injectRdtClient(
			`
			export default function App() {}`,
			'{ "config": { "defaultOpen":false,"position":"top-right","requireUrlFlag":false,"liveUrls":[{"url":"https://forge42.dev","name":"Production"},{"url":"https://forge42.dev/staging","name":"Staging"}]}, "plugins": "[tailwindPalettePlugin]" }',
			"",
			"/file/path"
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";

			export default _withViteDevTools(function App() {}, {
			config: {
				 defaultOpen: false,
				 position: "top-right",
				 requireUrlFlag: false,
				 liveUrls: [{
					 url: "https://forge42.dev",
					 name: "Production"
				 }, {
					 url: "https://forge42.dev/staging",
					 name: "Staging"
				 }]
		},
				plugins: [tailwindPalettePlugin]
			});

	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should inject the client config correctly", () => {
		const result = injectRdtClient(
			`
			export default function App() {}`,
			'{ "config": { "defaultOpen":false,"position":"top-right","requireUrlFlag":false,"liveUrls":[{"url":"https://forge42.dev","name":"Production"},{"url":"https://forge42.dev/staging","name":"Staging"}]}, "plugins": "[]" }',
			"",
			"/file/path"
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";

			export default _withViteDevTools(function App() {}, {
			config: {
				 defaultOpen: false,
				 position: "top-right",
				 requireUrlFlag: false,
				 liveUrls: [{
					 url: "https://forge42.dev",
					 name: "Production"
				 }, {
					 url: "https://forge42.dev/staging",
					 name: "Staging"
				 }]
		},
				plugins: []
			});

	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should inject multiple plugins correctly", () => {
		const result = injectRdtClient(
			`
			export default function App() {}`,
			'{ "config": { }, "plugins": "[tailwindPalettePlugin,coolPlugin]" }',
			'import tailwindPalettePlugin from "somewhere";import coolPlugin from "somewhere-else";',
			"/file/path"
		)
		const expected = removeWhitespace(`
			import tailwindPalettePlugin from "somewhere";
			import coolPlugin from "somewhere-else";
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";

			export default _withViteDevTools(function App() {}, {
			config: { },
				plugins: [tailwindPalettePlugin, coolPlugin]
			});

	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly, even if it's wrapped with a higher order function", () => {
		const result = injectRdtClient(
			`
			export default hoc(function App() {});
			function hoc(app) {
				return app;
			}
			`,
			'{ "config": { }, "plugins": "[]" }',
			"",
			"/file/path"
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";

			export default _withViteDevTools(hoc(function App() {}), {
			config: { },
				plugins: []
			});
			function hoc(app) {
				return app;
			}

	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly even if it's declared as a variable and then exported", () => {
		const result = injectRdtClient(
			`
			const App = () => {};
			export default App;
			`,
			'{ "config": { }, "plugins": "[]" }',
			"",
			"/file/path"
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";

			const App = () => {};
			export default _withViteDevTools(App, {
			config: { },
				plugins: []
			});

	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly even if it's declared as a variable and then exported via export { name as default }", () => {
		const result = injectRdtClient(
			`
			const App = () => {};
			export { App as default };
			`,
			'{ "config": { }, "plugins": "[]" }',
			"",
			"/file/path"
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";

			const App = () => {};
			export default _withViteDevTools(App, {
			config: { },
				plugins: []
			});

	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly even if it's declared as a variable and then exported via export { name as default } and has other exports as well", () => {
		const result = injectRdtClient(
			`
				import { test } from "./file/path";
			const App = () => {};
			export { App as default, test };
			`,
			'{ "config": { }, "plugins": "[]" }',
			"",
			"/file/path"
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";

			import { test } from "./file/path";
			const App = () => {};
			export default _withViteDevTools(App, {
			config: { },
				plugins: []
			});
			export { test };


	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly even if it's declared as a function and then exported", () => {
		const result = injectRdtClient(
			`
			function App() {};
			export default App;
			`,
			'{ "config": { }, "plugins": "[]" }',
			"",
			"/file/path"
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";

			function App() {};
			export default _withViteDevTools(App, {
			config: { },
				plugins: []
			});

	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly even if it's declared as a function and wrapped with a higher order function", () => {
		const result = injectRdtClient(
			`
			function App() {};
			export default hoc(App);
			function hoc(app) {
				return app;
			}
			`,
			'{ "config": { }, "plugins": "[]" }',
			"",
			"/file/path"
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";

			function App() {};
			export default _withViteDevTools(hoc(App), {
			config: { },
				plugins: []
			});
			function hoc(app) {
				return app;
			}

	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})

	it("should wrap the default export properly even if it's rexported from another file", () => {
		const result = injectRdtClient(
			`
			import { default as App } from "./app.js";
			export default App;
			`,
			'{ "config": { }, "plugins": "[]" }',
			"",
			"/file/path"
		)
		const expected = removeWhitespace(`
			import { withViteDevTools as _withViteDevTools } from "react-router-devtools/client";

			import { default as App } from "./app.js";
			export default _withViteDevTools(App, {
			config: { },
				plugins: []
			});

	 `)
		expect(removeWhitespace(result.code)).toStrictEqual(expected)
	})
})
