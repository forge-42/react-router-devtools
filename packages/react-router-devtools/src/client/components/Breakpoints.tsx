import clsx from "clsx"
import { useSettingsContext } from "../context/useRDTContext"
import { useOnWindowResize } from "../hooks/useOnWindowResize"

export const Breakpoints = () => {
	const { width } = useOnWindowResize()
	const { settings } = useSettingsContext()
	const breakpoints = settings.breakpoints
	const show = settings.showBreakpointIndicator
	const breakpoint = breakpoints.find((bp) => bp.min <= width && bp.max >= width)
	if (!breakpoint || !breakpoint.name || !show) {
		return null
	}
	return (
		<div
			className={clsx(
				"flex fixed bottom-0 left-0 mb-5 rounded-full bg-[#212121] z-[9998] size-10 text-white flex items-center justify-center items-center gap-2 mx-1"
			)}
		>
			{breakpoint?.name}
		</div>
	)
}
