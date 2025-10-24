import { useHtmlErrors, useSettingsContext } from "../context/useRDTContext.js"
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

interface TabsProps {
	setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
	plugins?: TabType[]
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
		// biome-ignore lint/a11y/useKeyWithClickEvents: ignored
		<div
			data-testid={tab.id}
			onClick={() => (onClick ? onClick() : setSettings({ activeTab: tab.id as TabsType }))}
			className={cx(
				"group",
				styles.layout.tabs.tab,
				activeTab !== tab.id && styles.layout.tabs.tabInactive,
				activeTab === tab.id && styles.layout.tabs.tabActive
			)}
		>
			<div className={cx(className, styles.layout.tabs.tabIcon)}>{tab.icon}</div>
			<div className={styles.layout.tabs.tabTooltip}>{tab.name}</div>
		</div>
	)
}

const Tabs = ({ plugins }: TabsProps) => {
	const { settings } = useSettingsContext()
	const { htmlErrors } = useHtmlErrors()
	const { styles } = useStyles()
	const { activeTab } = settings
	const { visibleTabs } = useTabs(plugins)
	const scrollRef = useHorizontalScroll()

	const getErrorCount = () => {
		return htmlErrors.length + (window.HYDRATION_OVERLAY?.ERROR ? 1 : 0)
	}

	const hasErrors = getErrorCount() > 0
	return (
		<div className={styles.layout.tabs.container}>
			<div ref={scrollRef} className={cx("react-router-dev-tools-tab", styles.layout.tabs.scrollContainer)}>
				{visibleTabs.map((tab) => (
					<Tab
						key={tab.id}
						tab={{
							...tab,
							name: tab.id === "errors" && hasErrors ? `Errors (${getErrorCount()})` : tab.name,
						}}
						activeTab={activeTab}
						className={cx(
							tab.id === "errors" && activeTab !== "errors" && hasErrors && styles.layout.tabs.tabErrorPulse
						)}
					/>
				))}
			</div>
		</div>
	)
}

export { Tabs }
