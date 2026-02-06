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

	it("should handle SET_WHOLE_STATE", () => {
		const newState = {
			...initialState,
			persistOpen: true,
			settings: {
				...initialState.settings,
				activeTab: "routes" as const,
			},
		}
		expect(
			rdtReducer(initialState, {
				type: "SET_WHOLE_STATE",
				payload: newState,
			})
		).toEqual(newState)
	})
})
