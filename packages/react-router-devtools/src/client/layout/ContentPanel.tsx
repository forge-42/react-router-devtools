import { Fragment } from "react"
import { useTabs } from "../hooks/useTabs.js"
import { cx } from "../styles/use-styles.js"
import { useStyles } from "../styles/use-styles.js"
import { TimelineTab } from "../tabs/TimelineTab.js"

const ContentPanel = () => {
	const { Component, hideTimeline, activeTab } = useTabs()
	const { styles } = useStyles()

	return (
		<div className={styles.layout.contentPanel.container}>
			<div
				className={cx(
					styles.layout.contentPanel.mainContent,
					activeTab === "page" && styles.layout.contentPanel.mainContentPageTab
				)}
			>
				{Component && <Component />}
			</div>

			{!hideTimeline && (
				<Fragment>
					<div className={styles.layout.contentPanel.divider} />
					<div className={styles.layout.contentPanel.timelineContainer}>
						<TimelineTab />
					</div>
				</Fragment>
			)}
		</div>
	)
}

export { ContentPanel }
