import * as Test from "@testing-library/react"
import * as testSuite from "../context/useRDTContext"

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
		const mockOpenSource = vi.fn()
		vi.mock("../utils/open-source", () => ({
			openSource: mockOpenSource,
		}))
		const { container } = renderDevTools({
			activeTab: "errors",
		})
		const parentElement = container.getByText("./src/client/context/useRDTContext.ts")
		Test.fireEvent.click(parentElement)
		expect(mockOpenSource).toHaveBeenCalledWith("./src/client/context/useRDTContext.ts")
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
		const mockOpenSource = vi.fn()
		vi.mock("../utils/open-source", () => ({
			openSource: mockOpenSource,
		}))
		const { container } = renderDevTools({
			activeTab: "errors",
		})
		const childEl = container.getByText("./src/client/tabs/ErrorsTab.test.tsx")
		Test.fireEvent.click(childEl)
		expect(mockOpenSource).toHaveBeenCalledWith("./src/client/tabs/ErrorsTab.test.tsx")
	})
})
