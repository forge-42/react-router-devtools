import { useMemo } from "react"
import type { ReactRouterDevtoolsState } from "../context/rdtReducer.js"
import { useSettingsContext } from "../context/useRDTContext.js"
import type { ReactRouterDevtoolsProps } from "../react-router-dev-tools.js"
import { type Tab, tabs } from "../tabs/index.js"
import type { Tabs } from "../tabs/index.js"

const shouldHideTimeline = (activeTab: Tabs, tab: Tab | undefined, settings: ReactRouterDevtoolsState["settings"]) => {
	if (activeTab === "routes" && settings.routeViewMode === "tree") return true
	return tab?.hideTimeline
}

export const useTabs = (pluginsArray?: ReactRouterDevtoolsProps["plugins"]) => {
	const { settings } = useSettingsContext()
	const { activeTab } = settings
	const plugins = pluginsArray?.map((plugin) => (typeof plugin === "function" ? plugin() : plugin))
	const allTabs = useMemo(() => [...tabs, ...(plugins ? plugins : [])], [plugins])

	const { Component, hideTimeline } = useMemo(() => {
		const tab = allTabs.find((tab) => tab.id === activeTab)
		return { Component: tab?.component, hideTimeline: shouldHideTimeline(activeTab, tab, settings) }
	}, [activeTab, allTabs, settings])

	return {
		visibleTabs: allTabs,
		Component,
		allTabs,
		hideTimeline,
		activeTab,
		isPluginTab: !tabs.find((tab) => activeTab === tab.id),
	}
}
