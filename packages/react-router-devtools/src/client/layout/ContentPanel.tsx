import clsx from "clsx"
import { Fragment } from "react"
import { useTabs } from "../hooks/useTabs.js"
import { TimelineTab } from "../tabs/TimelineTab.js"
import type { Tab } from "../tabs/index.js"

interface ContentPanelProps {
	leftSideOriented: boolean
	plugins?: Tab[]
}

const ContentPanel = ({ plugins }: ContentPanelProps) => {
	const { Component, hideTimeline, isPluginTab, activeTab } = useTabs(plugins)

	return (
		<div className="flex h-full w-full overflow-y-hidden">
			<div
				className={clsx(
					"z-20 h-full w-full overflow-y-auto overflow-x-hidden bg-main px-1 lg:px-4 pt-3 pb-4 ",

					isPluginTab && "unset",
					activeTab === "page" && "!pt-0"
				)}
			>
				{Component}
			</div>

			{!hideTimeline && (
				<Fragment>
					<div className="w-1 bg-gray-500/20" />
					<div className={clsx("z-10 hidden lg:block h-full w-1/3 p-2")}>
						<TimelineTab />
					</div>
				</Fragment>
			)}
		</div>
	)
}

export { ContentPanel }
