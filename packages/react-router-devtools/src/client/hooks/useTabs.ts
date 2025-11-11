import { useMemo } from "react"
import { useSettingsContext } from "../context/useRDTContext.js"
import { type Tab, tabs } from "../tabs/index.js"

const shouldHideTimeline = (tab: Tab | undefined) => {
	return tab?.hideTimeline
}

export const useTabs = () => {
	const { settings } = useSettingsContext()
	const { activeTab } = settings
	const allTabs = tabs

	const { Component, hideTimeline } = useMemo(() => {
		const tab = allTabs.find((tab) => tab.id === activeTab)
		return {
			Component: tab?.component,
			hideTimeline: shouldHideTimeline(tab),
		}
	}, [activeTab, allTabs])

	return {
		visibleTabs: allTabs,
		Component,
		allTabs,
		hideTimeline,
		activeTab,
	}
}
