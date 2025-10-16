import { useEffect, useRef } from "react"

export const useHorizontalScroll = () => {
	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const elem = ref.current
		const onWheel = (ev: WheelEvent) => {
			if (!elem || ev.deltaY === 0) return

			elem.scrollTo({
				left: elem.scrollLeft + ev.deltaY,
				behavior: "smooth",
			})
		}

		elem?.addEventListener("wheel", onWheel, { passive: true })

		return () => {
			elem?.removeEventListener("wheel", onWheel)
		}
	}, [])

	return ref
}
