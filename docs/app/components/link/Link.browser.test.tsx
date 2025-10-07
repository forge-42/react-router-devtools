import { waitFor } from "@testing-library/react"
import { userEvent } from "@vitest/browser/context"
import { useLocation } from "react-router"
import type { StubRouteEntry } from "tests/setup.browser"
import { Link, type LinkProps } from "./link"
const getEntries: (linkProps?: LinkProps) => StubRouteEntry[] = (linkProps) => [
	{
		path: "/first",
		Component: () => {
			const url = useLocation()
			return (
				<>
					<p>
						{url.pathname} + {url.search}
					</p>
					<Link {...linkProps} to="/second">
						go
					</Link>
				</>
			)
		},
	},
	{
		path: "/second",
		Component: () => {
			const url = useLocation()
			return (
				<>
					<p>
						{url.pathname}
						{url.search}
					</p>
					<Link to="/first">go</Link>
				</>
			)
		},
	},
]
describe("Link", () => {
	it("if the url is /first and you redirect to  /second nothing is added to the url", async ({ renderStub }) => {
		const { getByText } = await renderStub({
			entries: getEntries(),
			props: {
				initialEntries: ["/first"],
			},
		})
		const link = getByText("go")
		await userEvent.click(link)
		const url = getByText("/second")
		expect(url).toBeDefined()
		await waitFor(() => {
			expect(url.element()).toBeDefined()
			expect(url.element()).toHaveTextContent("/second")
		})
	})

	it("if the url is /first?a=1 and you redirect to /second without keepSearchParams nothing is added to the url", async ({
		renderStub,
	}) => {
		const { getByText } = await renderStub({
			entries: getEntries(),
			props: {
				initialEntries: ["/first?a=1"],
			},
		})
		const link = getByText("go")
		await userEvent.click(link)
		const url = getByText("/second")
		await waitFor(() => {
			expect(url.element()).toBeDefined()
			expect(url.element()).toHaveTextContent("/second")
		})
	})

	it("if the url is /first?a=1 and you redirect to /second with keepSearchParams search params are kept", async ({
		renderStub,
	}) => {
		const { getByText } = await renderStub({
			entries: getEntries({ keepSearchParams: true, to: "/second" }),
			props: {
				initialEntries: ["/first?a=1"],
			},
		})
		const link = getByText("go")
		await userEvent.click(link)
		const url = getByText("/second")
		await waitFor(() => {
			expect(url.element()).toBeDefined()
			expect(url.element()).toHaveTextContent("/second?a=1")
		})
	})

	it("if the url is /first?a=1&lng=en and you redirect to /second with keepSearchParams search params and language are kept", async ({
		renderStub,
	}) => {
		const { getByText } = await renderStub({
			entries: getEntries({ keepSearchParams: true, to: "/second" }),
			props: {
				initialEntries: ["/first?a=1&lng=en"],
			},
		})
		const link = getByText("go")
		await userEvent.click(link)
		const url = getByText("/second")
		await waitFor(() => {
			expect(url.element()).toBeDefined()
			expect(url.element()).toHaveTextContent("/second?a=1&lng=en")
		})
	})

	it("if the url is /first?a=1&lng=en and you redirect to /second without keepSearchParams language is kept", async ({
		renderStub,
	}) => {
		const { getByText } = await renderStub({
			entries: getEntries({ to: "/second" }),
			props: {
				initialEntries: ["/first?lng=en"],
			},
		})
		const link = getByText("go")
		await userEvent.click(link)
		const url = getByText("/second")
		await waitFor(() => {
			expect(url.element()).toBeDefined()
			expect(url.element()).toHaveTextContent("/second?lng=en")
		})
	})

	it("if the url is /first?a=1&lng=en and you redirect to /second with a language override it is changed and search params are removed", async ({
		renderStub,
	}) => {
		const { getByText } = await renderStub({
			entries: getEntries({ to: "/second", language: "bs" }),
			props: {
				initialEntries: ["/first?lng=en"],
			},
		})
		const link = getByText("go")
		await userEvent.click(link)
		const url = getByText("/second")
		await waitFor(() => {
			expect(url.element()).toBeDefined()
			expect(url.element()).toHaveTextContent("/second?lng=bs")
		})
	})

	it("if the url is /first?a=1&lng=en and you redirect to /second with a language override it is changed and search params are kept with keepSearchParams", async ({
		renderStub,
	}) => {
		const { getByText } = await renderStub({
			entries: getEntries({ to: "/second", language: "bs", keepSearchParams: true }),
			props: {
				initialEntries: ["/first?a=a&lng=en"],
			},
		})
		const link = getByText("go")
		await userEvent.click(link)
		const url = getByText("/second")
		await waitFor(() => {
			expect(url.element()).toBeDefined()
			expect(url.element()).toHaveTextContent("/second?a=a&lng=bs")
		})
	})
})
