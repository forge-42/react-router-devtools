import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { isTypegenContext } from "./detect-typegen"

describe("isTypegenContext", () => {
	const originalEnv = process.env
	const originalArgv = process.argv

	beforeEach(() => {
		// Reset environment to clean state
		process.env = { ...originalEnv }
		process.argv = [...originalArgv]
	})

	afterEach(() => {
		// Restore environment after test
		process.env = originalEnv
		process.argv = originalArgv
	})

	describe("environment variable detection", () => {
		it("should return true when TYPEGEN_RUNNING=1", () => {
			process.env.TYPEGEN_RUNNING = "1"
			expect(isTypegenContext()).toBe(true)
		})

		it("should return true when SAFE_ROUTES_TYPEGEN=1", () => {
			process.env.SAFE_ROUTES_TYPEGEN = "1"
			expect(isTypegenContext()).toBe(true)
		})

		it("should return true when npm_lifecycle_event contains typegen (pre)", () => {
			// cspell:disable-next-line
			process.env.npm_lifecycle_event = "pretypegen"
			expect(isTypegenContext()).toBe(true)
		})

		it("should return true when npm_lifecycle_event contains typegen (post)", () => {
			// cspell:disable-next-line
			process.env.npm_lifecycle_event = "posttypegen"
			expect(isTypegenContext()).toBe(true)
		})
	})

	describe("command line argument detection", () => {
		it("should return true when process.argv contains typegen", () => {
			process.argv = ["node", "script.js", "typegen"]
			expect(isTypegenContext()).toBe(true)
		})

		it("should return true when process.argv contains type-gen", () => {
			process.argv = ["node", "script.js", "type-gen"]
			expect(isTypegenContext()).toBe(true)
		})

		it("should return true when process.argv contains react-router typegen", () => {
			process.argv = ["node", "script.js", "react-router", "typegen"]
			expect(isTypegenContext()).toBe(true)
		})

		it("should return true when process.argv contains safe-routes", () => {
			process.argv = ["node", "script.js", "safe-routes"]
			expect(isTypegenContext()).toBe(true)
		})
	})

	describe("normal context", () => {
		it("should return false when no typegen indicators are present", () => {
			expect(isTypegenContext()).toBe(false)
		})

		it("should return false with unrelated environment variables", () => {
			process.env.OTHER_VAR = "1"
			expect(isTypegenContext()).toBe(false)
		})

		it("should return false with unrelated command line arguments", () => {
			process.argv = ["node", "script.js", "dev", "build"]
			expect(isTypegenContext()).toBe(false)
		})

		it("should return false when TYPEGEN_RUNNING=0", () => {
			process.env.TYPEGEN_RUNNING = "0"
			expect(isTypegenContext()).toBe(false)
		})

		it("should return false when TYPEGEN_RUNNING is empty string", () => {
			process.env.TYPEGEN_RUNNING = ""
			expect(isTypegenContext()).toBe(false)
		})
	})
})
