import type { Dispatch } from "react"
import type React from "react"
import { createContext, useEffect, useMemo, useReducer } from "react"
import type { NetworkRequest } from "../components/network-tracer/types.js"
import { useRemoveBody } from "../hooks/detached/useRemoveBody.js"
import { checkIsDetached, checkIsDetachedOwner, checkIsDetachedWindow } from "../utils/detached.js"
import { tryParseJson } from "../utils/sanitize.js"
import {
	REACT_ROUTER_DEV_TOOLS_CHECK_DETACHED,
	REACT_ROUTER_DEV_TOOLS_DETACHED,
	REACT_ROUTER_DEV_TOOLS_SETTINGS,
	REACT_ROUTER_DEV_TOOLS_STATE,
	getStorageItem,
	setSessionItem,
	setStorageItem,
} from "../utils/storage.js"
import { type RemixDevToolsActions, type RemixDevToolsState, initialState, rdtReducer } from "./rdtReducer.js"

export const RDTContext = createContext<{
	state: RemixDevToolsState
	dispatch: Dispatch<RemixDevToolsActions>
}>({ state: initialState, dispatch: () => null })

RDTContext.displayName = "RDTContext"

interface ContextProps {
	children: React.ReactNode
	config?: RdtClientConfig
}

export const setIsDetachedIfRequired = () => {
	const isDetachedWindow = checkIsDetachedWindow()
	if (!isDetachedWindow && window.RDT_MOUNTED) {
		setSessionItem(REACT_ROUTER_DEV_TOOLS_DETACHED, "true")
	}
}

export const resetIsDetachedCheck = () => {
	setStorageItem(REACT_ROUTER_DEV_TOOLS_CHECK_DETACHED, "false")
}

export const detachedModeSetup = () => {
	resetIsDetachedCheck()
	setIsDetachedIfRequired()
	const isDetachedWindow = checkIsDetachedWindow()
	const isDetached = checkIsDetached()
	const isDetachedOwner = checkIsDetachedOwner()

	if (isDetachedWindow && !isDetached) {
		window.close()
	}
	if (!isDetached && isDetachedOwner) {
		//setSessionItem(REMIX_DEV_TOOLS_DETACHED_OWNER, "false");
		// isDetachedOwner = false;
	}
	return {
		detachedWindow: window.RDT_MOUNTED ?? isDetachedWindow,
		detachedWindowOwner: isDetachedOwner,
	}
}

export const getSettings = () => {
	const settingsString = getStorageItem(REACT_ROUTER_DEV_TOOLS_SETTINGS)
	const settings = tryParseJson<RemixDevToolsState["settings"]>(settingsString)
	return {
		...settings,
	}
}

export const getExistingStateFromStorage = (config?: RdtClientConfig & { editorName?: string }) => {
	const existingState = getStorageItem(REACT_ROUTER_DEV_TOOLS_STATE)
	const settings = getSettings()

	const { detachedWindow, detachedWindowOwner } = detachedModeSetup()
	const state: RemixDevToolsState = {
		...initialState,
		...(existingState ? JSON.parse(existingState) : {}),
		settings: {
			...initialState.settings,
			...config,
			...settings,
			editorName: config?.editorName ?? initialState.settings.editorName,
			liveUrls: config?.liveUrls ?? initialState.settings.liveUrls,
			breakpoints: config?.breakpoints ?? initialState.settings.breakpoints,
		},
		detachedWindow,
		detachedWindowOwner,
	}
	return state
}

export type RdtClientConfig = Pick<
	RemixDevToolsState["settings"],
	| "defaultOpen"
	| "breakpoints"
	| "showBreakpointIndicator"
	| "showRouteBoundariesOn"
	| "expansionLevel"
	| "liveUrls"
	| "position"
	| "height"
	| "minHeight"
	| "maxHeight"
	| "hideUntilHover"
	| "panelLocation"
	| "requireUrlFlag"
	| "urlFlag"
	| "routeBoundaryGradient"
>

export const RDTContextProvider = ({ children, config }: ContextProps) => {
	const [state, dispatch] = useReducer<typeof rdtReducer>(rdtReducer, getExistingStateFromStorage(config))
	// biome-ignore lint/correctness/useExhaustiveDependencies: investigate
	const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

	useRemoveBody(state)

	useEffect(() => {
		const { settings, detachedWindow, detachedWindowOwner, ...rest } = state
		// Store user settings for dev tools into local storage
		setStorageItem(REACT_ROUTER_DEV_TOOLS_SETTINGS, JSON.stringify(settings))
		// Store general state into local storage
		setStorageItem(REACT_ROUTER_DEV_TOOLS_STATE, JSON.stringify(rest))
	}, [state])

	return <RDTContext.Provider value={value}>{children}</RDTContext.Provider>
}
