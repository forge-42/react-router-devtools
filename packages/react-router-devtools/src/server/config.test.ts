import { getConfig } from "./config"

describe("getConfig Test suite", () => {
	it("should return the server config when set on the process object", () => {
		process.rdt_config = {
			silent: true,
		}
		expect(getConfig()).toEqual({
			silent: true,
		})
	})

	it("should return an empty object if the config is not set on the process object", () => {
		process.rdt_config = {}
		expect(getConfig()).toEqual({})
	})
})
