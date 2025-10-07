export const getStorageItem = (key: string) => localStorage.getItem(key)
export const setStorageItem = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value)
	} catch (_e) {
		return
	}
}

export const removeStorageItem = (key: string) => localStorage.removeItem(key)
export const THEME = "theme"
export const COMMAND_K_SEARCH_HISTORY = "command-k-search-history"
