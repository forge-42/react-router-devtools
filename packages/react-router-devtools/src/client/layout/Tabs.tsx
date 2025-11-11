import { useSettingsContext } from "../context/useRDTContext.js"
import { useHorizontalScroll } from "../hooks/useHorizontalScroll.js"
import { useTabs } from "../hooks/useTabs.js"
import { cx } from "../styles/use-styles.js"
import { useStyles } from "../styles/use-styles.js"
import type { Tab as TabType, Tabs as TabsType } from "../tabs/index.js"

declare global {
	interface Window {
		RDT_MOUNTED: boolean
	}
}

const Tab = ({
	tab,
	activeTab,
	className,
	onClick,
}: {
	tab: TabType
	activeTab?: string
	className?: string
	onClick?: () => void
}) => {
	const { setSettings } = useSettingsContext()
	const { styles } = useStyles()

	return (
		<button
			data-testid={tab.id}
			onClick={() => (onClick ? onClick() : setSettings({ activeTab: tab.id as TabsType }))}
			title={typeof tab.name === "string" ? tab.name : undefined}
			type="button"
			className={cx(
				"group",
				styles.layout.tabs.tab,
				activeTab !== tab.id && styles.layout.tabs.tabInactive,
				activeTab === tab.id && styles.layout.tabs.tabActive
			)}
		>
			<div className={cx(className, styles.layout.tabs.tabIcon)}>{tab.icon}</div>
		</button>
	)
}

const Tabs = () => {
	const { settings } = useSettingsContext()
	const { styles } = useStyles()
	const { activeTab } = settings
	const { visibleTabs } = useTabs()
	const scrollRef = useHorizontalScroll()

	return (
		<div className={styles.layout.tabs.container}>
			<div ref={scrollRef} className={cx("react-router-dev-tools-tab", styles.layout.tabs.scrollContainer)}>
				{visibleTabs.map((tab) => (
					<Tab key={tab.id} tab={tab} activeTab={activeTab} />
				))}
			</div>
		</div>
	)
}

export { Tabs }
