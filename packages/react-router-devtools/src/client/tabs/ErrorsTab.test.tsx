import * as Test from "@testing-library/react"
import * as testSuite from "../context/useRDTContext"

import * as devHook from "../hooks/useDevServerConnection.js"

describe("ErrorsTab", () => {
	it("should show no errors title if there are no errors", async ({ renderDevTools }) => {
		const { container } = renderDevTools({
			activeTab: "errors",
		})
		expect(container.getByText("No errors detected!")).toBeDefined()
	})
	it("should show html errors if there are any and display everything properly", async ({ renderDevTools }) => {
		vi.spyOn(testSuite, "useHtmlErrors").mockReturnValue({
			htmlErrors: [
				{
					child: {
						file: "./src/client/tabs/ErrorsTab.test.tsx",
						tag: "test-element",
					},
					parent: {
						file: "./src/client/context/useRDTContext.ts",
						tag: "test-element-1",
					},
				},
			],
			setHtmlErrors: vi.fn(),
		})
		const { container } = renderDevTools({
			activeTab: "errors",
		})
		expect(() => container.getByText("No errors detected!")).throws()
		expect(container.getByText("HTML Nesting Errors")).toBeDefined()
		// The tab should show the number of errors
		expect(container.getByText("Errors (1)")).toBeDefined()

		expect(container.getByText("element can't be nested inside of", { exact: false })).toBeDefined()
		expect(container.getByText("test-element")).toBeDefined()
		expect(container.getByText("test-element-1")).toBeDefined()
		// The locations of the parent error is displayed correctly
		expect(container.getByText("The parent element is located inside of the", { exact: false })).toBeDefined()
		expect(container.getByText("./src/client/context/useRDTContext.ts")).toBeDefined()
		// The locations of the child error is displayed correctly
		expect(container.getByText("The child element is located inside of the", { exact: false })).toBeDefined()
		expect(container.getByText("./src/client/tabs/ErrorsTab.test.tsx")).toBeDefined()
	})

	it("should send the open source request when clicked on the parent element text", async ({ renderDevTools }) => {
		vi.spyOn(testSuite, "useHtmlErrors").mockReturnValue({
			htmlErrors: [
				{
					child: {
						file: "./src/client/tabs/ErrorsTab.test.tsx",
						tag: "test-element",
					},
					parent: {
						file: "./src/client/context/useRDTContext.ts",
						tag: "test-element-1",
					},
				},
			],
			setHtmlErrors: vi.fn(),
		})
		const sendOpenSource = vi.fn()
		vi.spyOn(devHook, "useDevServerConnection").mockReturnValue({
			sendJsonMessage: sendOpenSource,
			connectionStatus: "Open",
			isConnected: true,
		})
		const { container } = renderDevTools({
			activeTab: "errors",
		})
		const parentElement = container.getByText("./src/client/context/useRDTContext.ts")
		Test.fireEvent.click(parentElement)
		expect(sendOpenSource).toHaveBeenCalledWith({
			data: {
				source: "./src/client/context/useRDTContext.ts",
			},
			type: "open-source",
		})
	})

	it("should send the open source request when clicked on the child element text", async ({ renderDevTools }) => {
		vi.spyOn(testSuite, "useHtmlErrors").mockReturnValue({
			htmlErrors: [
				{
					child: {
						file: "./src/client/tabs/ErrorsTab.test.tsx",
						tag: "test-element",
					},
					parent: {
						file: "./src/client/context/useRDTContext.ts",
						tag: "test-element-1",
					},
				},
			],
			setHtmlErrors: vi.fn(),
		})
		const sendOpenSource = vi.fn()
		vi.spyOn(devHook, "useDevServerConnection").mockReturnValue({
			sendJsonMessage: sendOpenSource,
			connectionStatus: "Open",
			isConnected: true,
		})
		const { container } = renderDevTools({
			activeTab: "errors",
		})
		const childEl = container.getByText("./src/client/tabs/ErrorsTab.test.tsx")
		Test.fireEvent.click(childEl)
		expect(sendOpenSource).toHaveBeenCalledWith({
			data: {
				source: "./src/client/tabs/ErrorsTab.test.tsx",
			},
			type: "open-source",
		})
	})

	it("should show a hydration mismatch error if the server has a mismatch", async ({ renderDevTools }) => {
		window.HYDRATION_OVERLAY = {
			ERROR: true,
			SSR_HTML: "hydration-mismatch",
			CSR_HTML: "hydration-mismatch2",
			APP_ROOT_SELECTOR: "",
		}
		const { container } = renderDevTools({
			activeTab: "errors",
		})
		// The tab should show the number of errors
		expect(container.getByText("Errors (2)")).toBeDefined()
		// Shows the overlay properly
		expect(container.getByText("Hydration mismatch comparison")).toBeDefined()
		expect(container.getByText("Server-Side Render")).toBeDefined()
		expect(container.getByText("Client-Side Render")).toBeDefined()
		expect(container.getByText("hydration-mismatch2")).toBeDefined()
		// @ts-expect-error
		window.HYDRATION_OVERLAY = undefined
	})
})
