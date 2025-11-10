import { useCallback, useContext } from "react"
import { RDTContext } from "./RDTContext.js"
import type { ReactRouterDevtoolsState } from "./rdtReducer.js"
import type { TimelineEvent } from "./timeline/types.js"

/**
 * Returns an object containing the current state and dispatch function of the RDTContext.
 * Throws an error if used outside of a RDTContextProvider.
 * - Saves the state to session storage on every state change.
 * - Saves the settings to local storage on every settings state change.
 * @returns {Object} An object containing the following properties:
 *  - dispatch: A function to dispatch actions to the RDTContext reducer.
 *  - state: The current state of the RDTContext.
 */
const useRDTContext = () => {
	const context = useContext(RDTContext)
	if (context === undefined) {
		throw new Error("useRDTContext must be used within a RDTContextProvider")
	}
	const { state, dispatch } = context
	return {
		dispatch,
		state,
	}
}

export const useServerInfo = () => {
	const { state, dispatch } = useRDTContext()
	const { server } = state
	const setServerInfo = useCallback(
		(serverInfo: Partial<ReactRouterDevtoolsState["server"]>) => {
			dispatch({
				type: "SET_SERVER_INFO",
				payload: {
					...server,
					...serverInfo,
					routes: {
						...server?.routes,
						...serverInfo?.routes,
					},
				},
			})
		},
		[dispatch, server]
	)
	return { server, setServerInfo }
}

export const useSettingsContext = () => {
	const { dispatch, state } = useRDTContext()
	const { settings } = state
	const setSettings = useCallback(
		(settings: Partial<ReactRouterDevtoolsState["settings"]>) => {
			dispatch({
				type: "SET_SETTINGS",
				payload: settings,
			})
		},
		[dispatch]
	)
	return { setSettings, settings }
}

export const usePersistOpen = () => {
	const { dispatch, state } = useRDTContext()
	const { persistOpen } = state
	const setPersistOpen = useCallback(
		(persistOpen: boolean) => {
			dispatch({
				type: "SET_PERSIST_OPEN",
				payload: persistOpen,
			})
		},
		[dispatch]
	)
	return { persistOpen, setPersistOpen }
}
/**
 * Returns an object containing functions and state related to the timeline context.
 * @returns {Object} An object containing the following properties:
 *  - setTimelineEvent: A function that sets a new timeline event.
 *  - timeline: An array of timeline events.
 *  - clearTimeline: A function that clears all timeline events.
 */
export const useTimelineContext = () => {
	const { state, dispatch } = useRDTContext()
	const { timeline } = state
	const setTimelineEvent = useCallback(
		(payload: TimelineEvent) => {
			dispatch({ type: "SET_TIMELINE_EVENT", payload })
		},
		[dispatch]
	)
	const clearTimeline = useCallback(() => {
		dispatch({ type: "PURGE_TIMELINE", payload: undefined })
	}, [dispatch])

	return { setTimelineEvent, timeline, clearTimeline }
}

export { useRDTContext }
