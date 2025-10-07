import clsx from "clsx"
import { useSettingsContext } from "../context/useRDTContext.js"
import { Icon } from "./icon/Icon.js"

export const RouteToggle = () => {
	const { settings, setSettings } = useSettingsContext()
	const { routeViewMode } = settings
	return (
		<div className="absolute left-0 top-0 flex items-center gap-2 rounded-lg border border-white px-3 py-1">
			<Icon
				className={clsx("h-5 w-5 hover:cursor-pointer", routeViewMode === "tree" && "text-yellow-500")}
				onClick={() => setSettings({ routeViewMode: "tree" })}
				name="Network"
			/>
			/
			<Icon
				name="List"
				className={clsx("h-5 w-5 hover:cursor-pointer", routeViewMode === "list" && "text-yellow-500")}
				onClick={() => setSettings({ routeViewMode: "list" })}
			/>
		</div>
	)
}
