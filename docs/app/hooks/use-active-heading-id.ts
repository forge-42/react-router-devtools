import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router"

// tracks the currently active heading on the page using IntersectionObserver and URL hash
export function useActiveHeadingId(selector = "h2[id], h3[id], h4[id]") {
	const [activeId, setActiveId] = useState<string | null>(null)
	const activeIdRef = useRef<string | null>(null)
	const isManualRef = useRef(false)
	const timeoutRef = useRef<number | undefined>(undefined)

	const location = useLocation()

	useEffect(() => {
		activeIdRef.current = activeId
	}, [activeId])

	const setManualActiveId = useCallback((id: string) => {
		setActiveId(id)
		isManualRef.current = true
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
		timeoutRef.current = window.setTimeout(() => {
			isManualRef.current = false
		}, 1000)
	}, [])

	// biome-ignore lint/correctness/useExhaustiveDependencies: location.pathname shoud be in the dependency array
	useEffect(() => {
		const headings = Array.from(document.querySelectorAll<HTMLElement>(selector))
		if (!headings.length) {
			setActiveId(null)
			return
		}

		const initialHash = window.location.hash.slice(1)
		if (initialHash && document.getElementById(initialHash)) {
			setActiveId(initialHash)
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (isManualRef.current) return

				const visible = new Set(entries.filter((e) => e.isIntersecting).map((e) => e.target))

				const firstVisible = headings.find((h) => visible.has(h))

				if (firstVisible && firstVisible.id !== activeIdRef.current) {
					setActiveId(firstVisible.id)
				}
			},
			{
				rootMargin: "0% 0% -60% 0%",
				threshold: 0,
			}
		)
		for (const heading of headings) {
			observer.observe(heading)
		}

		const handleHashChange = () => {
			const id = window.location.hash.slice(1)
			if (id && document.getElementById(id)) {
				setManualActiveId(id)
			}
		}

		window.addEventListener("hashchange", handleHashChange)

		return () => {
			observer.disconnect()
			window.removeEventListener("hashchange", handleHashChange)
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
		}
	}, [selector, location.pathname, setManualActiveId])

	return { activeId, setManualActiveId }
}
