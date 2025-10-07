import clsx from "clsx"
import { Link, useLocation } from "react-router"
import { useSettingsContext } from "../context/useRDTContext"

export const LiveUrls = () => {
	const { settings } = useSettingsContext()
	const location = useLocation()
	const envsPosition = settings.liveUrlsPosition
	const envsClassName = {
		"bottom-0": envsPosition === "bottom-left" || envsPosition === "bottom-right",
		"top-0": envsPosition === "top-left" || envsPosition === "top-right",
		"right-0": envsPosition === "bottom-right" || envsPosition === "top-right",
		"left-0": envsPosition === "bottom-left" || envsPosition === "top-left",
	}
	if (settings.liveUrls.length === 0) return null
	return (
		<div className={clsx("flex fixed items-center z-[9998] gap-2 px-2", envsClassName)}>
			{settings.liveUrls.map((env) => {
				return (
					<Link
						key={env.name}
						referrerPolicy="no-referrer"
						target="_blank"
						to={env.url + location.pathname}
						className="flex transition-all hover:text-gray-500 items-center gap-2 text-sm font-semibold text-gray-400"
					>
						{env.name}
					</Link>
				)
			})}
		</div>
	)
}
