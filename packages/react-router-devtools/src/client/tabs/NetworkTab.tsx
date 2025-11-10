import { TabHeader } from "../components/TabHeader.js"
import { Icon } from "../components/icon/Icon.js"
import NetworkPanel from "../components/network-tracer/NetworkPanel.js"
import { useStyles } from "../styles/use-styles.js"

export const NetworkTab = () => {
	const { styles } = useStyles()
	return (
		<div className={styles.networkTab.wrapper}>
			<TabHeader icon={<Icon name="Network" />} title="Network" />
			<div className={styles.networkTab.container}>
				<NetworkPanel />
			</div>
		</div>
	)
}
