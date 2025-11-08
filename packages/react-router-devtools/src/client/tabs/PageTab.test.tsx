import * as Test from "@testing-library/react"

import preview from "jest-preview"
import { Outlet, useLoaderData } from "react-router"
import * as useServerInfoHook from "../context/useRDTContext"
import * as devHook from "../hooks/useDevServerConnection.js"

describe("PageTab", () => {
	it("should show all route segments on active page tab when there are multiple route segments", async ({
		renderDevTools,
	}) => {
		const { container } = renderDevTools({
			props: {
				initialEntries: ["/users/1/posts/1"],
			},
			entries: [
				{
					id: "users",
					path: "/users",
					HydrateFallback: () => <div />,
					loader: () => {
						return { root: "data" }
					},
					children: [
						{
							id: "users/:userId",
							path: "/users/:userId",
							Component: () => (
								<div>
									users:userId
									<Outlet />
								</div>
							),
							children: [
								{
									id: "users/:userId/posts",
									path: "/users/:userId/posts",
									handle: {
										"test-handle": "test-handle",
									},
									Component: () => (
										<div>
											users:userId/posts
											<Outlet />
										</div>
									),
									children: [
										{
											id: "users/:userId/posts/:postId",
											path: "/users/:userId/posts/:postId",
											Component: () => <div> /users/:userId/posts/:postId</div>,
										},
									],
								},
							],
						},
					],
					Component: () => (
						<div>
							users
							<Outlet />
						</div>
					),
				},
			],
		})
		await Test.waitFor(() => {
			const trigger = container.getByTestId("react-router-devtools-trigger")
			Test.fireEvent.click(trigger)
			const mainPanel = container.getByTestId("react-router-devtools-main-panel")
			const withinPanel = Test.within(mainPanel)
			// Find all the pannels and make sure they are rendered properly
			const rootSegment = withinPanel.getByTestId("root")
			const usersSegment = withinPanel.getByTestId("users")
			const usersUserIdSegment = withinPanel.getByTestId("users/:userId")
			const usersUserIdPostsSegment = withinPanel.getByTestId("users/:userId/posts")
			const usersUserIdPostsPostIdSegment = withinPanel.getByTestId("users/:userId/posts/:postId")
			expect(rootSegment).toBeDefined()
			expect(usersSegment).toBeDefined()
			expect(usersUserIdSegment).toBeDefined()
			expect(usersUserIdPostsSegment).toBeDefined()
			expect(usersUserIdPostsPostIdSegment).toBeDefined()
			const withinRootSegment = Test.within(rootSegment)
			const withinUsersSegment = Test.within(usersSegment)
			const withinUsersUserIdSegment = Test.within(usersUserIdSegment)
			const withinUsersUserIdPostsSegment = Test.within(usersUserIdPostsSegment)
			const withinUsersUserIdPostsPostIdSegment = Test.within(usersUserIdPostsPostIdSegment)

			// Each route segment renders the correct route id
			expect(withinRootSegment.getByText("Route segment file: root")).toBeDefined()
			expect(withinUsersSegment.getByText("Route segment file: users")).toBeDefined()
			expect(withinUsersUserIdSegment.getByText("Route segment file: users/:userId")).toBeDefined()
			expect(withinUsersUserIdPostsSegment.getByText("Route segment file: users/:userId/posts")).toBeDefined()
			expect(
				withinUsersUserIdPostsPostIdSegment.getByText("Route segment file: users/:userId/posts/:postId")
			).toBeDefined()

			// Each route segment renders the correct route path
			expect(withinRootSegment.getByText("/")).toBeDefined()
			expect(withinUsersSegment.getByText("/users")).toBeDefined()
			expect(withinUsersUserIdSegment.getByText("/users/1")).toBeDefined()
			expect(withinUsersUserIdPostsSegment.getByText("/users/1/posts")).toBeDefined()
			expect(withinUsersUserIdPostsPostIdSegment.getByText("/users/1/posts/1")).toBeDefined()
			// Renders route params for each route segment
			expect(withinRootSegment.getByText("Route params")).toBeDefined()
			expect(withinUsersSegment.getByText("Route params")).toBeDefined()
			expect(withinUsersUserIdSegment.getByText("Route params")).toBeDefined()
			expect(withinUsersUserIdPostsSegment.getByText("Route params")).toBeDefined()
			expect(withinUsersUserIdPostsPostIdSegment.getByText("Route params")).toBeDefined()
			// Renders loader data only for the route segment that has a loader
			expect(withinUsersSegment.getByText("Returned loader data")).toBeDefined()
			// Doesn't exist for the other ones
			expect(() => withinRootSegment.getByText("Returned loader data")).throws()
			expect(() => withinUsersUserIdSegment.getByText("Returned loader data")).throws()
			expect(() => withinUsersUserIdPostsSegment.getByText("Returned loader data")).throws()
			expect(() => withinUsersUserIdPostsPostIdSegment.getByText("Returned loader data")).throws()
			// Only renders the route handle for the route segment that has a handle
			expect(() => withinRootSegment.getByText("Route handle")).throws()
			expect(() => withinUsersSegment.getByText("Route handle")).throws()
			expect(() => withinUsersUserIdSegment.getByText("Route handle")).throws()
			expect(withinUsersUserIdPostsSegment.getByText("Route handle")).toBeDefined()
			expect(() => withinUsersUserIdPostsPostIdSegment.getByText("Route handle")).throws()
		})
	})

	it("should attempt to open the route in the editor when the open in editor button is clicked", async ({
		renderDevTools,
	}) => {
		const mockOpenSource = vi.fn()
		vi.mock("../utils/open-source", () => ({
			openSource: mockOpenSource,
		}))
		vi.spyOn(devHook, "useDevServerConnection").mockReturnValue({
			sendJsonMessage: vi.fn(),
			connectionStatus: "Open",
			isConnected: true,
		})
		const { container } = renderDevTools({ opened: true })

		const openInEditor = container.getByTestId("root-open-source")

		Test.fireEvent.click(openInEditor)

		expect(mockOpenSource).toHaveBeenCalled()
	})

	it("should show the route cache information if recieved from the server and last loader timestamp is available, also should display it as private if it's private", async ({
		renderDevTools,
	}) => {
		vi.spyOn(useServerInfoHook, "useServerInfo").mockReturnValue({
			setServerInfo: vi.fn(),
			server: {
				routes: {
					root: {
						loaderTriggerCount: 1,
						actionTriggerCount: 1,
						lowestExecutionTime: 0,
						highestExecutionTime: 0,
						averageExecutionTime: 0,
						lastLoader: {
							executionTime: 50,
							timestamp: Date.now(),
							responseHeaders: {
								"Cache-Control": "max-age=3000, s-maxage=300, private",
							},
						},
						lastAction: {
							executionTime: 0,
							timestamp: 0,
						},
						loaders: [],
						actions: [],
					},
				},
			},
		})
		const { container } = renderDevTools({ opened: true })

		expect(
			container.getByText("[Private] Loader Cache expires in about 1 hour", {
				exact: false,
			})
		).toBeDefined()
	})

	it("should show the route cache information if recieved from the server and last loader timestamp is available, also should display it as public if not private", async ({
		renderDevTools,
	}) => {
		vi.spyOn(useServerInfoHook, "useServerInfo").mockReturnValue({
			setServerInfo: vi.fn(),
			server: {
				routes: {
					root: {
						loaderTriggerCount: 1,
						actionTriggerCount: 1,
						lowestExecutionTime: 0,
						highestExecutionTime: 0,
						averageExecutionTime: 0,
						lastLoader: {
							executionTime: 50,
							timestamp: Date.now(),
							responseHeaders: {
								"Cache-Control": "max-age=3000, s-maxage=300",
							},
						},
						lastAction: {
							executionTime: 0,
							timestamp: 0,
						},
						loaders: [],
						actions: [],
					},
				},
			},
		})
		const { container } = renderDevTools({ opened: true })

		expect(
			container.getByText("[Shared] Loader Cache expires in about 1 hour", {
				exact: false,
			})
		).toBeDefined()
	})

	it("should not show the route cache information if received from the server but no timestamp is available", async ({
		renderDevTools,
	}) => {
		vi.spyOn(useServerInfoHook, "useServerInfo").mockReturnValue({
			setServerInfo: vi.fn(),
			server: {
				routes: {
					root: {
						loaderTriggerCount: 1,
						actionTriggerCount: 1,
						lowestExecutionTime: 0,
						highestExecutionTime: 0,
						averageExecutionTime: 0,
						lastLoader: {
							executionTime: 0,
							timestamp: 0,
							responseHeaders: {
								"Cache-Control": "max-age=3000, s-maxage=300, private",
							},
						},
						lastAction: {
							executionTime: 0,
							timestamp: 0,
						},
						loaders: [],
						actions: [],
					},
				},
			},
		})
		const { container } = renderDevTools({ opened: true })

		expect(() =>
			container.getByText("[Shared] Loader Cache expires in about 1 hour", {
				exact: false,
			})
		).throws()
	})

	it("should not show the route cache information if not recieved from the server", async ({ renderDevTools }) => {
		vi.spyOn(useServerInfoHook, "useServerInfo").mockReturnValue({
			setServerInfo: vi.fn(),
			server: {
				routes: {
					root: {
						loaderTriggerCount: 1,
						actionTriggerCount: 1,
						lowestExecutionTime: 0,
						highestExecutionTime: 0,
						averageExecutionTime: 0,
						lastLoader: {
							executionTime: 0,
							timestamp: 0,
						},
						lastAction: {
							executionTime: 0,
							timestamp: 550,
						},
						loaders: [],
						actions: [],
					},
				},
			},
		})
		const { container } = renderDevTools({ opened: true })

		expect(() =>
			container.getByText("[Shared] Loader Cache expires in about 1 hour", {
				exact: false,
			})
		).throws()
	})

	it("should show the server info if it's available", async ({ renderDevTools }) => {
		vi.spyOn(useServerInfoHook, "useServerInfo").mockReturnValue({
			setServerInfo: vi.fn(),
			server: {
				routes: {
					root: {
						loaderTriggerCount: 1,
						actionTriggerCount: 1,
						lowestExecutionTime: 0,
						highestExecutionTime: 0,
						averageExecutionTime: 0,
						lastLoader: {
							executionTime: 50,
							timestamp: Date.now(),
							responseHeaders: {
								"Cache-Control": "max-age=3000, s-maxage=300, private",
							},
						},
						lastAction: {
							executionTime: 0,
							timestamp: 0,
						},
						loaders: [],
						actions: [],
					},
				},
			},
		})
		const { container } = renderDevTools({ opened: true })
		expect(container.getByText("Server information")).toBeDefined()
	})

	it("should revalidate the info properly when revalidate button clicked", async ({ renderDevTools }) => {
		const { container } = renderDevTools({
			opened: true,
			props: {
				initialEntries: ["/user"],
			},
			entries: [
				{
					id: "user",
					path: "/user",
					Component: () => {
						const data = useLoaderData()

						return <div data-value={data.date}>Date: {data.date}</div>
					},
					HydrateFallback: () => <div>hey?</div>,
					loader: () => {
						return { date: Date.now() }
					},
				},
			],
		})

		await Test.waitFor(async () => {
			preview.debug()
			const currentDate = container.getByText("Date:", { exact: false })
			const currentValue = currentDate.getAttribute("data-value")
			const revalidateButton = container.getByTestId("revalidate-button")
			Test.fireEvent.click(revalidateButton)
			await Test.waitFor(() => {
				const newDate = container.getByText("Date:", { exact: false })
				const newValue = newDate.getAttribute("data-value")
				expect(newValue).not.toBe(currentValue)
			})
		})
	})
})
