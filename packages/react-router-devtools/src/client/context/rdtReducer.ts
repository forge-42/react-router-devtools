import type { Tabs } from "../tabs/index.js"
import { cutArrayToFirstN } from "../utils/common.js"
import type { TimelineEvent } from "./timeline/types.js"

// Gradient keys for use with Goober styles
export const ROUTE_BOUNDARY_GRADIENTS = {
	sea: "sea",
	hyper: "hyper",
	gotham: "gotham",
	gray: "gray",
	watermelon: "watermelon",
	ice: "ice",
	silver: "silver",
} as const

export type RouteWildcards = Record<string, Record<string, string> | undefined>

export type ReactRouterDevtoolsState = {
	timeline: TimelineEvent[]
	settings: {
		/**
		 * The route boundary gradient color to use
		 * @default "silver"
		 */
		editorName: string
		/**
		 * The route boundary gradient color to use
		 * @default "watermelon"
		 */
		routeBoundaryGradient: keyof typeof ROUTE_BOUNDARY_GRADIENTS
		routeWildcards: RouteWildcards
		activeTab: Tabs
		/**
		 * The initial expansion level of the JSON viewer objects
		 * @default 1
		 */
		expansionLevel: number
		hoveredRoute: string
		isHoveringRoute: boolean
		routeViewMode: "list" | "tree"

		withServerDevTools: boolean
	}
	persistOpen: boolean
}

export const initialState: ReactRouterDevtoolsState = {
	timeline: [],
	settings: {
		editorName: "VSCode",
		routeBoundaryGradient: "watermelon",
		routeWildcards: {},
		activeTab: "page",
		expansionLevel: 1,
		hoveredRoute: "",
		isHoveringRoute: false,
		routeViewMode: "tree",
		withServerDevTools: true,
	},
	persistOpen: false,
}

/** Reducer action types */
type SetTimelineEvent = {
	type: "SET_TIMELINE_EVENT"
	payload: TimelineEvent
}

type SetWholeState = {
	type: "SET_WHOLE_STATE"
	payload: ReactRouterDevtoolsState
}

type SetSettings = {
	type: "SET_SETTINGS"
	payload: Partial<ReactRouterDevtoolsState["settings"]>
}

type PurgeTimeline = {
	type: "PURGE_TIMELINE"
	payload: undefined
}

type SetIsSubmittedAction = {
	type: "SET_IS_SUBMITTED"
	// biome-ignore lint/suspicious/noExplicitAny: we want to allow any extra fields here
	payload: any
}

type SetPersistOpenAction = {
	type: "SET_PERSIST_OPEN"
	payload: boolean
}

/** Aggregate of all action types */
export type ReactRouterDevtoolsActions =
	| SetTimelineEvent
	| PurgeTimeline
	| SetSettings
	| SetWholeState
	| SetIsSubmittedAction
	| SetPersistOpenAction

export const rdtReducer = (
	state: ReactRouterDevtoolsState,
	{ type, payload }: ReactRouterDevtoolsActions
): ReactRouterDevtoolsState => {
	switch (type) {
		case "SET_SETTINGS":
			return {
				...state,
				settings: {
					...state.settings,
					...payload,
				},
			}

		case "SET_TIMELINE_EVENT":
			return {
				...state,
				timeline: cutArrayToFirstN([payload, ...state.timeline], 30),
			}

		case "SET_WHOLE_STATE": {
			return {
				...payload,
			}
		}

		case "PURGE_TIMELINE":
			return {
				...state,
				timeline: [],
			}
		case "SET_IS_SUBMITTED":
			return {
				...state,
				...payload,
				isSubmitted: true,
			}

		case "SET_PERSIST_OPEN":
			return {
				...state,
				persistOpen: payload,
			}
		default:
			return state
	}
}
