import { parseCacheControlHeader } from "./parser"

describe("parseCacheControlHeader Test suite", () => {
	it("should return an object with the expected keys and values", () => {
		const header = "max-age=3600, s-maxage=600, private"
		const result = parseCacheControlHeader(new Headers({ "Cache-Control": header }))
		expect(result).toEqual({
			maxAge: "3600",
			sMaxage: "600",
			private: true,
		})
	})

	it("should return an empty object if the cache header is an empty object", () => {
		const header = ""
		const result = parseCacheControlHeader(new Headers({ "Cache-Control": header }))
		expect(result).toEqual({})
	})

	it("should return an empty object if the cache header is not present", () => {
		const result = parseCacheControlHeader(new Headers())
		expect(result).toEqual({})
	})
})
