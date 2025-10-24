import { Fragment } from "react"
import { useTabs } from "../hooks/useTabs.js"
import { cx } from "../styles/use-styles.js"
import { useStyles } from "../styles/use-styles.js"
import { TimelineTab } from "../tabs/TimelineTab.js"
import type { Tab } from "../tabs/index.js"

interface ContentPanelProps {
	plugins?: Tab[]
}

const ContentPanel = ({ plugins }: ContentPanelProps) => {
	const { Component, hideTimeline, isPluginTab, activeTab } = useTabs(plugins)
	const { styles } = useStyles()

	return (
		<div className={styles.layout.contentPanel.container}>
			<div
				className={cx(
					styles.layout.contentPanel.mainContent,
					isPluginTab && styles.layout.contentPanel.mainContentUnset,
					activeTab === "page" && styles.layout.contentPanel.mainContentPageTab
				)}
			>
				{Component}
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
