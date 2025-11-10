import type { Dispatch } from "react"
import type React from "react"
import { createContext, useEffect, useMemo, useReducer } from "react"
import { bigIntReplacer } from "../../shared/bigint-util.js"
import { tryParseJson } from "../utils/sanitize.js"
import {
	REACT_ROUTER_DEV_TOOLS_SETTINGS,
	REACT_ROUTER_DEV_TOOLS_STATE,
	getStorageItem,
	setStorageItem,
} from "../utils/storage.js"
import {
	type ReactRouterDevtoolsActions,
	type ReactRouterDevtoolsState,
	initialState,
	rdtReducer,
} from "./rdtReducer.js"

export const RDTContext = createContext<{
	state: ReactRouterDevtoolsState
	dispatch: Dispatch<ReactRouterDevtoolsActions>
}>({ state: initialState, dispatch: () => null })

RDTContext.displayName = "RDTContext"

interface ContextProps {
	children: React.ReactNode
	config?: RdtClientConfig
}

export const getSettings = () => {
	const settingsString = getStorageItem(REACT_ROUTER_DEV_TOOLS_SETTINGS)
	const settings = tryParseJson<ReactRouterDevtoolsState["settings"]>(settingsString)
	return {
		...settings,
	}
}

export const getExistingStateFromStorage = (config?: RdtClientConfig & { editorName?: string }) => {
	const existingState = getStorageItem(REACT_ROUTER_DEV_TOOLS_STATE)
	const settings = getSettings()

	const state: ReactRouterDevtoolsState = {
		...initialState,
		...(existingState ? JSON.parse(existingState) : {}),
		settings: {
			...initialState.settings,
			...config,
			...settings,
			editorName: config?.editorName ?? initialState.settings.editorName,
		},
	}
	return state
}

export type RdtClientConfig = Pick<
	ReactRouterDevtoolsState["settings"],
	"showRouteBoundariesOn" | "expansionLevel" | "routeBoundaryGradient"
>

export const RDTContextProvider = ({ children, config }: ContextProps) => {
	const [state, dispatch] = useReducer(rdtReducer, getExistingStateFromStorage(config))
	// biome-ignore lint/correctness/useExhaustiveDependencies: investigate
	const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

	useEffect(() => {
		const { settings, ...rest } = state
		// Store user settings for dev tools into local storage
		setStorageItem(REACT_ROUTER_DEV_TOOLS_SETTINGS, JSON.stringify(settings))
		// Store general state into local storage
		setStorageItem(REACT_ROUTER_DEV_TOOLS_STATE, JSON.stringify(rest, bigIntReplacer))
	}, [state])

	return <RDTContext.Provider value={value}>{children}</RDTContext.Provider>
}
