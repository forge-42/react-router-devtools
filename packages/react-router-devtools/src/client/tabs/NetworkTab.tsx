import { TabHeader } from "../components/TabHeader.js"
import { Icon } from "../components/icon/Icon.js"
import NetworkPanel from "../components/network-tracer/NetworkPanel.js"
import { useRequestContext } from "../context/requests/request-context.js"
import { useStyles } from "../styles/use-styles.js"

export const NetworkTab = () => {
	const { styles } = useStyles()
	const { requests, removeAllRequests, isLimitReached } = useRequestContext()
	return (
		<div className={styles.networkTab.wrapper}>
			<TabHeader
				icon={<Icon name="Network" />}
				title="Network"
				rightContent={
					<>
						{isLimitReached && (
							<span className={styles.networkTab.limitWarning}>
								<Icon name="Shield" size="sm" />
								Limit reached
							</span>
						)}
						<span className={styles.networkTab.headerCount}>{requests.length}</span>
						{requests.length > 0 && (
							<button type="button" onClick={() => removeAllRequests()} className={styles.networkTab.clearButton}>
								<Icon name="X" />
								<span>Clear</span>
							</button>
						)}
					</>
				}
			/>
			<div className={styles.networkTab.container}>
				<NetworkPanel />
			</div>
		</div>
	)
}
