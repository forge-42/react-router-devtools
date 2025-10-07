import {
	REACT_ROUTER_DEV_TOOLS_DETACHED,
	REACT_ROUTER_DEV_TOOLS_DETACHED_OWNER,
	REACT_ROUTER_DEV_TOOLS_IS_DETACHED,
	getBooleanFromSession,
	getBooleanFromStorage,
} from "./storage.js"

export const checkIsDetachedWindow = () => getBooleanFromSession(REACT_ROUTER_DEV_TOOLS_DETACHED)
export const checkIsDetached = () => getBooleanFromStorage(REACT_ROUTER_DEV_TOOLS_IS_DETACHED)
export const checkIsDetachedOwner = () => getBooleanFromSession(REACT_ROUTER_DEV_TOOLS_DETACHED_OWNER)
