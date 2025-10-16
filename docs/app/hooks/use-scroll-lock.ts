import { useEffect, useRef } from "react"

/**
 * Locks the body scroll when `isActive` is true.
 * Uses position: fixed + scroll restoration (avoids layout shift).
 */
export function useScrollLock(isActive: boolean) {
	const scrollYRef = useRef(0)

	useEffect(() => {
		if (!isActive) return

		scrollYRef.current = window.scrollY
		const body = document.body
		const html = document.documentElement

		const prevBodyStyle = {
			position: body.style.position,
			top: body.style.top,
			width: body.style.width,
		}
		const prevHtmlOverscroll = html.style.overscrollBehavior

		body.style.position = "fixed"
		body.style.top = `-${scrollYRef.current}px`
		body.style.width = "100%"

		html.style.overscrollBehavior = "contain"

		return () => {
			body.style.position = prevBodyStyle.position
			body.style.top = prevBodyStyle.top
			body.style.width = prevBodyStyle.width
			html.style.overscrollBehavior = prevHtmlOverscroll

			window.scrollTo(0, scrollYRef.current)
		}
	}, [isActive])
}
