export const getStorageItem = (key: string) => localStorage.getItem(key)
export const setStorageItem = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value)
	} catch (_e) {
		return
	}
}
export const getSessionItem = (key: string) => sessionStorage.getItem(key)
export const setSessionItem = (key: string, value: string) => {
	try {
		sessionStorage.setItem(key, value)
	} catch (_e) {
		return
	}
}

export const getBooleanFromStorage = (key: string) => getStorageItem(key) === "true"
export const getBooleanFromSession = (key: string) => getSessionItem(key) === "true"

export const REACT_ROUTER_DEV_TOOLS = "react_router_devtools"
export const REACT_ROUTER_DEV_TOOLS_STATE = "react_router_devtools_state"
export const REACT_ROUTER_DEV_TOOLS_SETTINGS = "react_router_devtools_settings"
