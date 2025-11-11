import type { ComponentType, JSX } from "react"
import { Icon } from "../components/icon/Icon.js"
import { NetworkTab } from "./NetworkTab.js"
import { PageTab } from "./PageTab.js"
import { RoutesTab } from "./RoutesTab.js"

export type Tabs = (typeof tabs)[number]["id"]

export interface Tab {
	name: string | JSX.Element
	icon: JSX.Element
	id: string
	component: ComponentType
	hideTimeline: boolean
}

export const tabs = [
	{
		name: "Active page",
		icon: <Icon size="md" name="Layers" />,
		id: "page",
		component: PageTab,
		hideTimeline: false,
	},
	{
		name: "Routes",
		icon: <Icon size="md" name="GitMerge" />,
		id: "routes",
		component: RoutesTab,
		hideTimeline: false,
	},
	{
		name: "Network",
		icon: <Icon size="md" name="Network" />,
		id: "network",
		component: NetworkTab,

		hideTimeline: true,
	},
] as const
