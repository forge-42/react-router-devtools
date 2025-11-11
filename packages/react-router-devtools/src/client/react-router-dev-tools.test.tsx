describe("General tests", () => {
	it.skip("should render without crashing", ({ renderDevTools }) => {
		// Skipped: TanStack devtools requires server bus connection which isn't available in tests
		// The devtools now uses TanStack's infrastructure for mounting/unmounting
		const { container } = renderDevTools()
		// TanStack devtools trigger has the data-testid
		expect(container.getByTestId("react-router-devtools-trigger")).toBeDefined()
	})

	// Note: Most UI tests have been removed as the devtools now uses TanStack Devtools
	// for the UI layer. The custom trigger, panel, positioning, hotkeys, and other UI
	// features are managed by TanStack.
	//
	// If you need to test TanStack-specific functionality, refer to TanStack Devtools docs.
	// The tests below focus on React Router specific functionality within the devtools.
})
