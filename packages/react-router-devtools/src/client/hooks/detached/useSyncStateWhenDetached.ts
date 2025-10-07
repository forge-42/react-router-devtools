import { getExistingStateFromStorage } from "../../context/RDTContext.js"
import { useRDTContext } from "../../context/useRDTContext.js"
import { REACT_ROUTER_DEV_TOOLS_SETTINGS, REACT_ROUTER_DEV_TOOLS_STATE } from "../../utils/storage.js"
import { useAttachListener } from "../useAttachListener.js"

const refreshRequiredKeys = [REACT_ROUTER_DEV_TOOLS_SETTINGS, REACT_ROUTER_DEV_TOOLS_STATE]

export const useSyncStateWhenDetached = () => {
	const { dispatch, state } = useRDTContext()

	// biome-ignore lint/suspicious/noExplicitAny: this should be fixed
	useAttachListener("storage", "window", (e: any) => {
		// Not in detached mode
		if (!state.detachedWindow && !state.detachedWindowOwner) {
			return
		}
		// Not caused by the dev tools
		if (!refreshRequiredKeys.includes(e.key)) {
			return
		}
		// Check if the settings have not changed and early return
		if (e.key === REACT_ROUTER_DEV_TOOLS_SETTINGS) {
			const oldSettings = JSON.stringify(state.settings)
			if (oldSettings === e.newValue) {
				return
			}
		}
		// Check if the state has not changed and early return
		if (e.key === REACT_ROUTER_DEV_TOOLS_STATE) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { settings, ...rest } = state
			const oldState = JSON.stringify(rest)
			if (oldState === e.newValue) {
				return
			}
		}

		// store new state
		const newState = getExistingStateFromStorage()
		dispatch({ type: "SET_WHOLE_STATE", payload: newState })
	})
}
