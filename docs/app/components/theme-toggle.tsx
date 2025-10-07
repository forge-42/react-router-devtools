import { useLayoutEffect, useState } from "react"
import { IconButton } from "~/ui/icon-button"
import { applyTheme, getCurrentTheme } from "~/utils/theme"

export function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark" | null>(null)

	useLayoutEffect(() => {
		setTheme(getCurrentTheme())
	}, [])

	const toggle = () => {
		if (!theme) return
		const next = theme === "dark" ? "light" : "dark"
		applyTheme(next)
		setTheme(next)
	}

	if (theme === null) {
		return <IconButton aria-label="Loading theme..." name="SunMoon" />
	}

	const isDarkTheme = theme === "dark"
	return (
		<IconButton
			aria-label={`Switch to ${isDarkTheme ? "light" : "dark"} mode`}
			name={isDarkTheme ? "Moon" : "Sun"}
			onClick={toggle}
		/>
	)
}
