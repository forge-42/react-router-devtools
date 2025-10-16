import {
	getBooleanFromSession,
	getBooleanFromStorage,
	getSessionItem,
	getStorageItem,
	setSessionItem,
	setStorageItem,
} from "./storage.js"

describe("storage utils", () => {
	beforeEach(() => {
		localStorage.clear()
		sessionStorage.clear()
	})

	test("getStorageItem should return null if key does not exist", () => {
		expect(getStorageItem("non-existent-key")).toBeNull()
	})

	test("getSessionItem should return null if key does not exist", () => {
		expect(getSessionItem("non-existent-key")).toBeNull()
	})

	test("setStorageItem should set the value for the given key in localStorage", () => {
		setStorageItem("key", "value")
		expect(localStorage.getItem("key")).toBe("value")
	})

	test("setSessionItem should set the value for the given key in sessionStorage", () => {
		setSessionItem("key", "value")
		expect(sessionStorage.getItem("key")).toBe("value")
	})

	test('getBooleanFromStorage should return true if the value for the given key is "true"', () => {
		localStorage.setItem("key", "true")
		expect(getBooleanFromStorage("key")).toBe(true)
	})

	test('getBooleanFromStorage should return false if the value for the given key is not "true"', () => {
		localStorage.setItem("key", "false")
		expect(getBooleanFromStorage("key")).toBe(false)
	})

	test('getBooleanFromSession should return true if the value for the given key is "true"', () => {
		sessionStorage.setItem("key", "true")
		expect(getBooleanFromSession("key")).toBe(true)
	})

	test('getBooleanFromSession should return false if the value for the given key is not "true"', () => {
		sessionStorage.setItem("key", "false")
		expect(getBooleanFromSession("key")).toBe(false)
	})
})
