import { useSettingsContext } from "../context/useRDTContext.js"
import { cx, useStyles } from "../styles/use-styles.js"
import { Icon } from "./icon/Icon.js"

export const RouteToggle = () => {
	const { styles } = useStyles()
	const { settings, setSettings } = useSettingsContext()
	const { routeViewMode } = settings
	return (
		<div className={styles.routeToggle.container}>
			<Icon
				className={cx(styles.routeToggle.icon, routeViewMode === "tree" && styles.routeToggle.iconActive)}
				onClick={() => setSettings({ routeViewMode: "tree" })}
				name="Network"
			/>
			/
			<Icon
				name="List"
				className={cx(styles.routeToggle.icon, routeViewMode === "list" && styles.routeToggle.iconActive)}
				onClick={() => setSettings({ routeViewMode: "list" })}
			/>
		</div>
	)
}
