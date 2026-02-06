import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { THEME, getStorageItem, setStorageItem } from "../local-storage"

let store: Record<string, string>
let fake!: Storage

function installFakeLocalStorage() {
	store = {}
	fake = {
		getItem: vi.fn((k: string) => (k in store ? store[k] : null)),
		setItem: vi.fn((k: string, v: string) => {
			store[k] = String(v)
		}),
		removeItem: vi.fn((k: string) => {
			delete store[k]
		}),
		clear: vi.fn(() => {
			store = {}
		}),
		key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
		get length() {
			return Object.keys(store).length
		},
	} as unknown as Storage

	if (typeof window === "undefined") {
		globalThis.localStorage = fake
		return
	}

	vi.spyOn(window, "localStorage", "get").mockReturnValue(fake)
}

describe("local storage test suite", () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		installFakeLocalStorage()
		localStorage.clear()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe("getStorageItem", () => {
		it("returns the stored value for the given key", () => {
			localStorage.setItem(THEME, "dark")
			expect(getStorageItem(THEME)).toBe("dark")
		})

		it("returns null if the key is not found", () => {
			expect(getStorageItem("nonexistent")).toBeNull()
		})
	})

	describe("setStorageItem", () => {
		it("stores the value for the given key", () => {
			setStorageItem(THEME, "light")
			expect(localStorage.getItem(THEME)).toBe("light")
		})
	})
})
