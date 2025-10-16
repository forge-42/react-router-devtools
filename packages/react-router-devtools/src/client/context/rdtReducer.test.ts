import { initialState, rdtReducer } from "./rdtReducer.js"
import type { TimelineEvent } from "./timeline/types.js"
const timelineEvent: TimelineEvent = {
	to: "background",
	type: "REDIRECT",
	search: "GET",
	hash: "GET",
	method: "GET",
	id: "id",
}

const terminal = initialState.terminals[0]

describe("rdtReducer", () => {
	it("should return the initial state", () => {
		// biome-ignore lint/suspicious/noExplicitAny: test
		expect(rdtReducer(initialState, {} as any)).toEqual(initialState)
	})

	it("should handle SET_SETTINGS", () => {
		const payload = {
			routeWildcards: {
				"/foo": { wildcard: "bar" },
			},
			shouldConnectWithForge: true,
		}
		const expectedState = {
			...initialState,
			settings: {
				...initialState.settings,
				...payload,
			},
		}
		expect(rdtReducer(initialState, { type: "SET_SETTINGS", payload })).toEqual(expectedState)
	})

	it("should handle SET_TIMELINE_EVENT", () => {
		const expectedState = {
			...initialState,
			timeline: [timelineEvent],
		}
		expect(
			rdtReducer(initialState, {
				type: "SET_TIMELINE_EVENT",
				payload: timelineEvent,
			})
		).toEqual(expectedState)
	})

	it("should handle PURGE_TIMELINE", () => {
		const expectedState = {
			...initialState,
			timeline: [],
		}
		expect(
			rdtReducer(
				{
					...initialState,
					timeline: [timelineEvent],
				},
				{ type: "PURGE_TIMELINE", payload: undefined }
			)
		).toEqual(expectedState)
	})

	it("should handle SET_IS_SUBMITTED", () => {
		const expectedState = {
			...initialState,
			isSubmitted: true,
		}
		expect(
			rdtReducer(initialState, {
				type: "SET_IS_SUBMITTED",
				payload: undefined,
			})
		).toEqual(expectedState)
	})

	it("should handle SET_PROCESS_ID", () => {
		const expectedState = {
			...initialState,
			terminals: [{ ...terminal, processId: 1 }],
		}
		expect(
			rdtReducer(initialState, {
				type: "SET_PROCESS_ID",
				payload: { terminalId: 0, processId: 1 },
			})
		).toEqual(expectedState)
	})

	it("should not set process id if terminal doesn't exist", () => {
		const expectedState = {
			...initialState,
			terminals: [terminal],
		}
		expect(
			rdtReducer(initialState, {
				type: "SET_PROCESS_ID",
				payload: { terminalId: 5, processId: 1 },
			})
		).toEqual(expectedState)
	})

	it("should handle TOGGLE_TERMINAL_LOCK", () => {
		const expectedState = {
			...initialState,
			terminals: [{ ...terminal, locked: true }],
		}
		expect(
			rdtReducer(initialState, {
				type: "TOGGLE_TERMINAL_LOCK",
				payload: { terminalId: 0, locked: true },
			})
		).toEqual(expectedState)
	})

	it("should handle TOGGLE_TERMINAL_LOCK and change the lock on the correct terminal", () => {
		const expectedState = {
			...initialState,
			terminals: [
				{ ...terminal, locked: true },
				{ ...terminal, id: 1 },
			],
		}
		expect(
			rdtReducer(
				{
					...initialState,
					terminals: [...initialState.terminals, { ...terminal, id: 1 }],
				},
				{
					type: "TOGGLE_TERMINAL_LOCK",
					payload: { terminalId: 0, locked: true },
				}
			)
		).toEqual(expectedState)
	})

	it("should handle SET_PERSIST_OPEN", () => {
		const expectedState = {
			...initialState,
			persistOpen: true,
		}
		expect(
			rdtReducer(initialState, {
				type: "SET_PERSIST_OPEN",
				payload: true,
			})
		).toEqual(expectedState)
	})

	it("should handle SET_IS_SUBMITTED", () => {
		const expectedState = {
			...initialState,
			isSubmitted: true,
		}
		expect(
			rdtReducer(initialState, {
				type: "SET_IS_SUBMITTED",
				payload: undefined,
			})
		).toEqual(expectedState)
	})

	it("should remove terminal if found", () => {
		const expectedState = {
			...initialState,
			terminals: [],
		}
		expect(
			rdtReducer(initialState, {
				type: "ADD_OR_REMOVE_TERMINAL",
				payload: 0,
			})
		).toEqual(expectedState)
	})

	it("should add terminal if not found", () => {
		const expectedState = {
			...initialState,
			terminals: [{ ...terminal }, { ...terminal, id: 1 }],
		}

		expect(
			rdtReducer(initialState, {
				type: "ADD_OR_REMOVE_TERMINAL",
				payload: 1,
			})
		).toEqual(expectedState)
	})

	it("should add terminal output", () => {
		const expectedState = {
			...initialState,
			terminals: [
				{
					...terminal,
					output: [{ type: "command", value: "test" }],
				},
			],
		}
		expect(
			rdtReducer(initialState, {
				type: "ADD_TERMINAL_OUTPUT",
				payload: { terminalId: 0, output: { type: "command", value: "test" } },
			})
		).toEqual(expectedState)
	})

	it("should not add terminal output if terminal does not exist", () => {
		const expectedState = {
			...initialState,
		}
		expect(
			rdtReducer(initialState, {
				type: "ADD_TERMINAL_OUTPUT",
				payload: { terminalId: 2, output: { type: "command", value: "test" } },
			})
		).toEqual(expectedState)
	})

	it("should clear all terminal output for a valid terminalId", () => {
		const expectedState = {
			...initialState,
			terminals: [
				{
					...terminal,
					output: [],
				},
			],
		}
		expect(
			rdtReducer(
				{
					...initialState,
					terminals: [
						{
							...terminal,
							output: [{ type: "command", value: "test" }],
						},
					],
				},
				{
					type: "CLEAR_TERMINAL_OUTPUT",
					payload: 0,
				}
			)
		).toEqual(expectedState)
	})

	it("should not clear any output if terminal doesn't exist", () => {
		const expectedState = {
			...initialState,
			terminals: [{ ...terminal, output: [{ type: "command", value: "test" }] }],
		}
		expect(
			rdtReducer(
				{
					...initialState,
					terminals: [{ ...terminal, output: [{ type: "command", value: "test" }] }],
				},
				{
					type: "CLEAR_TERMINAL_OUTPUT",
					payload: 2,
				}
			)
		).toEqual(expectedState)
	})

	it("should add terminal history for a given terminal", () => {
		const expectedState = {
			...initialState,
			terminals: [
				{
					...terminal,
					history: ["npm run version"],
				},
			],
		}
		expect(
			rdtReducer(initialState, {
				type: "ADD_TERMINAL_HISTORY",
				payload: { terminalId: 0, history: "npm run version" },
			})
		).toEqual(expectedState)
	})

	it("should not add terminal history for a terminal that doesn't exist", () => {
		const expectedState = {
			...initialState,
		}
		expect(
			rdtReducer(initialState, {
				type: "ADD_TERMINAL_HISTORY",
				payload: { terminalId: 2, history: "npm run version" },
			})
		).toEqual(expectedState)
	})

	it("should toggle lock value when payload value is not specified", () => {
		const expectedState = {
			...initialState,
			terminals: [{ ...terminal, locked: true }],
		}
		expect(
			rdtReducer(initialState, {
				type: "TOGGLE_TERMINAL_LOCK",
				payload: { terminalId: 0 },
			})
		).toEqual(expectedState)
	})
})
