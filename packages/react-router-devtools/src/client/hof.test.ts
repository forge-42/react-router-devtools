import type { ClientActionFunctionArgs, ClientLoaderFunctionArgs } from "react-router"
import { withClientActionWrapper, withClientLoaderWrapper, withLinksWrapper } from "./hof"

describe("withClientLoaderWrapper Test suite", () => {
	it("should return a function that returns a Promise", () => {
		const request = new Request("http://localhost:3000")
		const clientLoader = async () => {
			return "test"
		}
		const wrapped = withClientLoaderWrapper(clientLoader, "test")
		expect(wrapped({ request, params: {}, serverLoader: (async () => {}) as any }) instanceof Promise).toBe(true)
	})

	it("should return a function that resolves to the expected value", async () => {
		const request = new Request("http://localhost:3000")
		const clientLoader = async () => {
			return "test"
		}
		const wrapped = withClientLoaderWrapper(clientLoader, "test")
		const result = await wrapped({ request, params: {}, serverLoader: (async () => {}) as any })
		expect(result).toBe("test")
	})

	it("should execute in roughly the same time as the original client loader [allow 10ms variance]", async () => {
		const request = new Request("http://localhost:3000")
		const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
		const start = performance.now()
		const clientLoader = async () => {
			await sleep(100)
			return "test"
		}
		await clientLoader()
		const end = performance.now()
		const originalTime = end - start

		const wrapped = withClientLoaderWrapper(clientLoader, "test")
		const wrappedStart = performance.now()
		await wrapped({ request, params: {}, serverLoader: (async () => {}) as any })
		const wrappedEnd = performance.now()
		const wrappedTime = wrappedEnd - wrappedStart
		// Allow for some variance in execution time
		expect(wrappedTime - originalTime).toBeLessThan(10)
	})

	it("should get the params and the request object passed down properly", async () => {
		const request = new Request("http://localhost:3000/test")
		const clientLoader = async ({ request, params }: ClientLoaderFunctionArgs) => {
			expect(request).toBeInstanceOf(Request)
			expect(request.url).toBe("http://localhost:3000/test")
			expect(params).toEqual({ test: "test" })
			return "test"
		}
		const wrapped = withClientLoaderWrapper(clientLoader, "test")
		await wrapped({ request, params: { test: "test" }, serverLoader: (async () => {}) as any })
	})

	it("should get the server loader passed down properly", async () => {
		const request = new Request("http://localhost:3000/test")
		const clientLoader = async ({ request, params, serverLoader }: ClientLoaderFunctionArgs) => {
			expect(serverLoader).toBeInstanceOf(Function)
			const result = await serverLoader()
			expect(result).toBe("test2")
			return "test"
		}
		const wrapped = withClientLoaderWrapper(clientLoader, "test")
		await wrapped({
			request,
			params: { test: "test" },
			serverLoader: (async () => {
				return "test2"
			}) as any,
		})
	})
})

describe("withLinksWrapper Test suite", () => {
	it("should work", () => {
		expect(withLinksWrapper).toBeTruthy()
	})
})

describe("withClientActionWrapper Test suite", () => {
	it("should return a function that returns a Promise", () => {
		const request = new Request("http://localhost:3000")
		const clientAction = async () => {
			return "test"
		}
		const wrapped = withClientActionWrapper(clientAction, "test")
		expect(wrapped({ request, params: {}, serverAction: (async () => {}) as any }) instanceof Promise).toBe(true)
	})

	it("should return a function that resolves to the expected value", async () => {
		const request = new Request("http://localhost:3000")
		const clientAction = async () => {
			return "test"
		}
		const wrapped = withClientActionWrapper(clientAction, "test")
		const result = await wrapped({ request, params: {}, serverAction: (async () => {}) as any })
		expect(result).toBe("test")
	})

	it("should execute in roughly the same time as the original client action [allow 10ms variance]", async () => {
		const request = new Request("http://localhost:3000")
		const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
		const start = performance.now()
		const clientAction = async () => {
			await sleep(100)
			return "test"
		}
		await clientAction()
		const end = performance.now()
		const originalTime = end - start

		const wrapped = withClientActionWrapper(clientAction, "test")
		const wrappedStart = performance.now()
		await wrapped({ request, params: {}, serverAction: (async () => {}) as any })
		const wrappedEnd = performance.now()
		const wrappedTime = wrappedEnd - wrappedStart
		// Allow for some variance in execution time
		expect(wrappedTime - originalTime).toBeLessThan(10)
	})

	it("should get the params and the request object passed down properly", async () => {
		const request = new Request("http://localhost:3000/test")
		const clientAction = async ({ request, params }: ClientActionFunctionArgs) => {
			expect(request).toBeInstanceOf(Request)
			expect(request.url).toBe("http://localhost:3000/test")
			expect(params).toEqual({ test: "test" })
			return "test"
		}
		const wrapped = withClientActionWrapper(clientAction, "test")
		await wrapped({ request, params: { test: "test" }, serverAction: (async () => {}) as any })
	})

	it("should get the server action passed down properly", async () => {
		const request = new Request("http://localhost:3000/test")
		const clientAction = async ({ serverAction }: ClientActionFunctionArgs) => {
			const result = await serverAction()
			expect(result).toBe("test2")
			return "test"
		}
		const wrapped = withClientActionWrapper(clientAction, "test")
		await wrapped({
			request,
			params: { test: "test" },
			serverAction: (async () => {
				return "test2"
			}) as any,
		})
	})
})

describe("withLinksWrapper Test suite", () => {
	it("should return a function that returns an array of links and the links should contain the rdt stylesheet", () => {
		const links = withLinksWrapper(() => [{ rel: "stylesheet", href: "test.css" }], "rdtStylesheet.css")
		const result = links()
		expect(result).toBeInstanceOf(Object)
		expect(result).toBeInstanceOf(Array)
		expect(result).toHaveLength(2)
		expect(result[0]).toEqual({ rel: "stylesheet", href: "test.css" })
		expect(result[1]).toEqual({ rel: "stylesheet", href: "rdtStylesheet.css" })
	})

	it("should return the links function with only the rdt stylesheet if the original links function returns an empty array", () => {
		const links = withLinksWrapper(() => [], "rdtStylesheet.css")
		const result = links()
		expect(result).toBeInstanceOf(Object)
		expect(result).toBeInstanceOf(Array)
		expect(result).toHaveLength(1)
		expect(result[0]).toEqual({ rel: "stylesheet", href: "rdtStylesheet.css" })
	})
})
