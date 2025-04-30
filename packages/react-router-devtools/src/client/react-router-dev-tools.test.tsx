import * as Test from "@testing-library/react"

describe("General tests", () => {
	it("should render without crashing", ({ renderDevTools }) => {
		const { container } = renderDevTools()
		expect(container.getByTestId("react-router-devtools")).toBeDefined()
	})

	it("the main panel should not be expanded by default", ({ renderDevTools }) => {
		const { container } = renderDevTools()
		const mainPanel = container.getByTestId("react-router-devtools-main-panel")
		expect(mainPanel.className).includes("!h-0")
	})

	it("should render the trigger properly", ({ renderDevTools }) => {
		const { container } = renderDevTools()
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger).toBeDefined()
	})

	it("the trigger should have the highest z-index", ({ renderDevTools }) => {
		const { container } = renderDevTools()
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger.getAttribute("style")).toEqual("z-index: 9999;")
	})
	it("the trigger should not take focus via tab", ({ renderDevTools }) => {
		const { container } = renderDevTools()
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger.getAttribute("tabindex")).toEqual("-1")
	})
	it("the main panel should be expanded when the trigger is clicked", ({ renderDevTools }) => {
		const { container } = renderDevTools({ opened: true })

		const mainPanel = container.getByTestId("react-router-devtools-main-panel")
		expect(mainPanel.className).not.includes("!h-0")
		expect(mainPanel.getAttribute("style")).includes("height: 400px")
	})

	it("the main panel should be collapsed when the trigger is clicked and then closed with the close button", async ({
		renderDevTools,
	}) => {
		const { container } = renderDevTools({ opened: true })

		const mainPanel = container.getByTestId("react-router-devtools-main-panel")
		expect(mainPanel.className).not.includes("!h-0")
		expect(mainPanel.getAttribute("style")).includes("height: 400px")

		const closePanel = container.getByTestId("close")
		Test.fireEvent.click(closePanel)

		const mainPanelAfter = container.getByTestId("react-router-devtools-main-panel")
		expect(mainPanelAfter.className).includes("!h-0")
	})

	it("should save the open state in localStorage", ({ renderDevTools }) => {
		const { container } = renderDevTools({ opened: true })

		container.unmount()
		const { container: secondContainer } = renderDevTools()
		const newPanel = secondContainer.getByTestId("react-router-devtools-main-panel")
		expect(newPanel.className).not.includes("!h-0")
	})

	it("should show the active page tab when opened", ({ renderDevTools }) => {
		const { container } = renderDevTools({ opened: true })

		const activeTab = container.getByText("Active Route Segments")
		expect(activeTab).toBeDefined()
	})

	it("hideUntilHover functionality off the trigger hides it from the screen until the user hovers it properly", ({
		renderDevTools,
	}) => {
		const { container, trigger } = renderDevTools({ opened: false, rdtConfig: { hideUntilHover: true } })
		if (!trigger) {
			return
		}
		expect(trigger.getAttribute("class")).includes("opacity-0")
		Test.fireEvent.focus(trigger)
		const newTrigger = container.getByTestId("react-router-devtools-trigger")
		expect(newTrigger.getAttribute("class")).not.includes("opacity-0")
	})

	it("should set the position of the trigger to bottom-right by default", ({ renderDevTools }) => {
		const { container } = renderDevTools()
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger.getAttribute("class")).toContain("bottom-0 right-0")
	})

	it("should set the position of the trigger to top-left when set to top-left", ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { position: "top-left" } })
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger.getAttribute("class")).toContain("left-0 top-0")
	})

	it("should set the position of the trigger to top-right when set to top-right", ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { position: "top-right" } })
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger.getAttribute("class")).toContain("right-0 top-0")
	})

	it("should set the position of the trigger to bottom-left when set to bottom-left", ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { position: "bottom-left" } })
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger.getAttribute("class")).toContain("bottom-0 left-0")
	})

	it("should set the position of the trigger to middle-left when set to middle-left", ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { position: "middle-left" } })
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger.getAttribute("class")).toContain("top-1/2")
		expect(trigger.getAttribute("class")).toContain("-translate-y-1/2")
		expect(trigger.getAttribute("class")).toContain("left-0")
	})

	it("should set the position of the trigger to middle-right when set to middle-right", ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { position: "middle-right" } })
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger.getAttribute("class")).toContain("top-1/2")
		expect(trigger.getAttribute("class")).toContain("-translate-y-1/2")
		expect(trigger.getAttribute("class")).toContain("right-0")
	})

	it("should set the position of the panel to bottom by default", ({ renderDevTools }) => {
		const { container } = renderDevTools()
		const panel = container.getByTestId("react-router-devtools-main-panel")
		expect(panel.getAttribute("class")).toContain("bottom-0")
	})

	it("should set the position of the panel to top when set to top", ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { panelLocation: "top" } })
		const panel = container.getByTestId("react-router-devtools-main-panel")
		expect(panel.getAttribute("class")).toContain("top-0")
	})

	it("should show live urls if configured to do so", ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { liveUrls: [{ url: "test", name: "Production" }] } })
		const liveUrls = container.getByText("Production")
		expect(liveUrls).toBeDefined()
	})

	it("should not show live urls if configured to do so", ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { liveUrls: [] } })
		const liveUrls = container.queryByTestId("Production")
		expect(liveUrls).toBeNull()
	})

	it("should show the lg breakpoint by default", ({ renderDevTools }) => {
		const { container } = renderDevTools()
		const breakpoint = container.getByText("lg")
		expect(breakpoint).toBeDefined()
	})

	it("should show the custom breakpoint when defined for the current screen width", ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { breakpoints: [{ name: "sm", min: 0, max: 1900 }] } })
		const breakpoint = container.getByText("sm")
		expect(breakpoint).toBeDefined()
	})

	it("should open and close dev tools with shift + a hotkey", async ({ renderDevTools }) => {
		const { container } = renderDevTools()

		Test.fireEvent.keyDown(document, { key: "a", shiftKey: true, code: "KeyA" })
		await Test.waitFor(() => {
			const trigger = container.queryByTestId("react-router-devtools-trigger")
			expect(trigger?.getAttribute("class")).toContain("hidden")
		})
		Test.fireEvent.keyDown(document, { key: "a", shiftKey: true, code: "KeyA" })
		await Test.waitFor(() => {
			const trigger = container.queryByTestId("react-router-devtools-trigger")
			expect(trigger?.getAttribute("class")).not.toContain("hidden")
		})
	})

	it("should open and close dev tools with another hotkey", async ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { openHotkey: "shift+b" } })

		Test.fireEvent.keyDown(document, { key: "b", shiftKey: true, code: "KeyB" })
		await Test.waitFor(() => {
			const trigger = container.queryByTestId("react-router-devtools-trigger")
			expect(trigger?.getAttribute("class")).toContain("hidden")
		})
		Test.fireEvent.keyDown(document, { key: "b", shiftKey: true, code: "KeyB" })
		await Test.waitFor(() => {
			const trigger = container.queryByTestId("react-router-devtools-trigger")
			expect(trigger?.getAttribute("class")).not.toContain("hidden")
		})
	})

	it("should open and close dev tools with another hotkey that's more advanced", async ({ renderDevTools }) => {
		const { container } = renderDevTools({ rdtConfig: { openHotkey: "shift+alt+b" } })

		Test.fireEvent.keyDown(document, { key: "b", altKey: true, shiftKey: true, code: "KeyB" })
		await Test.waitFor(() => {
			const trigger = container.queryByTestId("react-router-devtools-trigger")
			expect(trigger?.getAttribute("class")).toContain("hidden")
		})
		Test.fireEvent.keyDown(document, { key: "b", altKey: true, shiftKey: true, code: "KeyB" })
		await Test.waitFor(() => {
			const trigger = container.queryByTestId("react-router-devtools-trigger")
			expect(trigger?.getAttribute("class")).not.toContain("hidden")
		})
	})

	it("should close with the escape key", async ({ renderDevTools }) => {
		const { container } = renderDevTools({ opened: true })

		Test.fireEvent.keyDown(document, { key: "Escape", code: "Escape" })
		await Test.waitFor(() => {
			const trigger = container.queryByTestId("react-router-devtools-trigger")
			expect(trigger?.getAttribute("class")).toContain("hidden")
		})
	})

	it("should not do anything with the escape key when the dev tools are closed", async ({ renderDevTools }) => {
		const { container } = renderDevTools({ opened: false })

		Test.fireEvent.keyDown(document, { key: "Escape", code: "Escape" })
		await Test.waitFor(() => {
			const trigger = container.queryByTestId("react-router-devtools-trigger")
			expect(trigger?.getAttribute("class")).not.toContain("hidden")
		})
	})

	it("the main panel should contain tabindex -1 when the dev tools are closed", async ({ renderDevTools }) => {
		const { container } = renderDevTools({ opened: false })
		const mainPanel = container.getByTestId("react-router-devtools-main-panel")
		expect(mainPanel.getAttribute("tabindex")).toEqual("-1")
	})

	it("the main panel should not have tabIndex set when the dev tools are opened", async ({ renderDevTools }) => {
		const { container } = renderDevTools({ opened: true })
		const mainPanel = container.getByTestId("react-router-devtools-main-panel")
		expect(mainPanel.getAttribute("tabindex")).toEqual(null)
	})

	it("the trigger should have tabIndex set to -1 when the dev tools are closed", async ({ renderDevTools }) => {
		const { container } = renderDevTools({ opened: false })
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger.getAttribute("tabindex")).toEqual("-1")
	})

	it("the trigger should have tabIndex set to nothing when the dev tools are opened", async ({ renderDevTools }) => {
		const { container } = renderDevTools({ opened: true })
		const trigger = container.getByTestId("react-router-devtools-trigger")
		expect(trigger.getAttribute("tabindex")).toEqual(null)
	})

	it("whether open or closed, the main container should always have the main classes set", async ({
		renderDevTools,
	}) => {
		const { container } = renderDevTools({ opened: true })
		const mainContainer = container.getByTestId("react-router-devtools")
		expect(mainContainer.getAttribute("class")).toContain("react-router-dev-tools")
		expect(mainContainer.getAttribute("class")).toContain("react-router-dev-tools-reset")
	})
})
