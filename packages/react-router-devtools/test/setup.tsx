import "../src/input.css"
import * as Test from "@testing-library/react"
import preview from "jest-preview"
import { Outlet, type RoutesTestStubProps, createRoutesStub } from "react-router"
import { withViteDevTools } from "../src/client"
import type { RdtClientConfig } from "../src/client/context/RDTContext"
import type { Tabs } from "../src/client/tabs"

type StubRouteEntry = Parameters<typeof createRoutesStub>[0][0]

const renderDevTools = (args?: {
	props?: RoutesTestStubProps
	entries?: StubRouteEntry[]
	opened?: boolean
	activeTab?: Tabs
	rdtConfig?: Partial<RdtClientConfig>
}) => {
	const entries: StubRouteEntry[] = [
		{
			id: "root",
			path: "/",
			children: args?.entries ?? [],
			Component: withViteDevTools(
				() => (
					<div>
						Root
						<Outlet />
					</div>
				),
				// the cast is okay as this works
				args?.rdtConfig ? { config: args?.rdtConfig as RdtClientConfig } : {}
			),
		},
	]
	const props: RoutesTestStubProps = args?.props ?? {
		initialEntries: ["/"],
	}
	const Stub = createRoutesStub(entries)

	const container = Test.render(<Stub {...props} />)
	if (!args?.opened && !args?.activeTab) {
		return { container }
	}
	const trigger = container.getByTestId("react-router-devtools-trigger")
	// open dev tools and switch tab
	if (args?.activeTab) {
		Test.fireEvent.click(trigger)
		const activeTab = container.getByTestId(args?.activeTab)
		Test.fireEvent.click(activeTab)
		return { container, trigger, activeTab }
	}
	// open dev tools
	if (args?.opened) {
		Test.fireEvent.click(trigger)
		return { container, trigger }
	}

	return { container }
}

declare module "vitest" {
	export interface TestContext {
		renderDevTools: typeof renderDevTools
		debug: typeof preview.debug
	}
}

beforeEach((ctx) => {
	ctx.renderDevTools = renderDevTools
	ctx.debug = preview.debug
})

if (import.meta.hot) {
	Object.defineProperty(import.meta.hot, "off", {
		value: vi.fn(),
	})
}
afterEach(() => {
	sessionStorage.clear()
	localStorage.clear()
	vi.clearAllMocks()
})
