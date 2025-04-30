import { useEffect } from "react"
import type { ReactRouterDevtoolsState } from "../../context/rdtReducer.js"
import { REACT_ROUTER_DEV_TOOLS } from "../../utils/storage.js"

export const useRemoveBody = (state: ReactRouterDevtoolsState) => {
	useEffect(() => {
		if (!state.detachedWindow) {
			return
		}

		const elements = document.body.children
		document.body.classList.add("bg-[#212121]")
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i]
			if (element.id !== REACT_ROUTER_DEV_TOOLS) {
				element.classList.add("hidden")
			}
		}
	}, [state])
}
