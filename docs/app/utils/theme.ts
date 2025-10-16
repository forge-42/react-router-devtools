import { THEME, setStorageItem } from "./local-storage"

export function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "light"
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function getCurrentTheme(): "light" | "dark" {
	if (typeof document === "undefined") return "light"
	const theme = document.documentElement.getAttribute("data-theme")
	return theme === "dark" ? "dark" : "light"
}

export function applyTheme(theme: "light" | "dark") {
	document.documentElement.setAttribute("data-theme", theme)
	setStorageItem(THEME, theme)
}
