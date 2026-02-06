import { diffInMs, secondsToHuman } from "./perf"

describe("diffInMs", () => {
	it("should return the difference in milliseconds between two dates", () => {
		const start = Date.now()
		const end = Date.now() + 1000
		expect(diffInMs(start, end)).toBe(1000)
	})
})
describe("secondsToHuman", () => {
	it("should return the number of seconds as a human readable string", () => {
		// 1 second
		expect(secondsToHuman(1)).toBe("1s")
		// 1 minute
		expect(secondsToHuman(60)).toBe("1m")
		// 1 minute and 10 seconds
		expect(secondsToHuman(60 + 10)).toBe("1:10m")
		// 5 minutes
		expect(secondsToHuman(5 * 60)).toBe("5m")
		// 5 minutes and 2 seconds
		expect(secondsToHuman(5 * 60 + 2)).toBe("5:02m")
		// 5 minutes and 15 seconds
		expect(secondsToHuman(5 * 60 + 15)).toBe("5:15m")
		// 1 hour
		expect(secondsToHuman(60 * 60)).toBe("1h")
		// 1 hour and 1 minute
		expect(secondsToHuman(60 * 60 + 60)).toBe("1:01:00h")
		// 1 hour and 1 minute and 10 seconds
		expect(secondsToHuman(60 * 60 + 60 + 10)).toBe("1:01:10h")
	})
})
