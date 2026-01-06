import { beforeEach, describe, expect, it, vi } from "vitest"
import { reactRouterDevTools } from "./plugin"

// Mock the detect-typegen module
vi.mock("./utils/detect-typegen", () => ({
	isTypegenContext: vi.fn(),
}))

describe("reactRouterDevTools", () => {
	let isTypegenContext: ReturnType<typeof vi.fn>

	beforeEach(async () => {
		vi.clearAllMocks()
		const module = await import("./utils/detect-typegen")
		isTypegenContext = vi.mocked(module.isTypegenContext)
	})

	describe("typegen context", () => {
		it("should return empty array when in typegen context", () => {
			isTypegenContext.mockReturnValue(true)

			const plugins = reactRouterDevTools()

			expect(plugins).toEqual([])
			expect(isTypegenContext).toHaveBeenCalledTimes(1)
		})

		it("should return empty array even with config options in typegen context", () => {
			isTypegenContext.mockReturnValue(true)

			const plugins = reactRouterDevTools({
				client: { expansionLevel: 2 },
			})

			expect(plugins).toEqual([])
			expect(isTypegenContext).toHaveBeenCalledTimes(1)
		})
	})

	describe("normal context", () => {
		it("should return plugin array in normal context", () => {
			isTypegenContext.mockReturnValue(false)

			const plugins = reactRouterDevTools()

			expect(Array.isArray(plugins)).toBe(true)
			expect(plugins.length).toBeGreaterThan(0)
			expect(isTypegenContext).toHaveBeenCalledTimes(1)
		})

		it("should return multiple plugins including TanStack DevTools", () => {
			isTypegenContext.mockReturnValue(false)

			const plugins = reactRouterDevTools()

			// TanStack DevTools returns an array that gets spread
			// + 5 custom plugins = 6+ total
			expect(plugins.length).toBeGreaterThan(5)

			// Verify plugin names exist
			const pluginNames = plugins.filter((p) => p.name).map((p) => p.name)

			expect(pluginNames).toContain("react-router-devtools")
		})

		it("should return plugin array when config options are provided", () => {
			isTypegenContext.mockReturnValue(false)

			const plugins = reactRouterDevTools({
				server: { silent: false },
			})

			expect(Array.isArray(plugins)).toBe(true)
			expect(plugins.length).toBeGreaterThan(5)
		})
	})
})
