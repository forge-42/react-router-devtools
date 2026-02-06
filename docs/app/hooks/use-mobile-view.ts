import { useLayoutEffect, useState } from "react"

/**
 * Hook to determine if the current viewport is considered mobile (below `breakpoint` px).
 * Returns true if mobile, false otherwise.
 */
export function useMobileView(breakpoint = 1280) {
	const [isMobile, setIsMobile] = useState<boolean | null>(() =>
		typeof window === "undefined" ? null : window.innerWidth < breakpoint
	)

	useLayoutEffect(() => {
		const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
		const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
		setIsMobile(mql.matches)
		mql.addEventListener("change", onChange)
		return () => mql.removeEventListener("change", onChange)
	}, [breakpoint])

	return { isMobile }
}
