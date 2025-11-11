import clsx from "clsx"
import { useEffect, useState } from "react"
import { RDTContextProvider } from "./context/RDTContext.js"
import { useFindRouteOutlets } from "./hooks/useReactTreeListeners.js"
import { useSetRouteBoundaries } from "./hooks/useSetRouteBoundaries.js"
import { useTimelineHandler } from "./hooks/useTimelineHandler.js"
import { ContentPanel } from "./layout/ContentPanel.js"
import { MainPanel } from "./layout/MainPanel.js"
import { Tabs } from "./layout/Tabs.js"
import type { ReactRouterDevtoolsProps } from "./react-router-dev-tools.js"
// Import to ensure global reset styles are injected
import "./styles/use-styles.js"
import { RequestProvider } from "./context/requests/request-context.js"
import { REACT_ROUTER_DEV_TOOLS } from "./utils/storage.js"

export interface EmbeddedDevToolsProps extends ReactRouterDevtoolsProps {
	mainPanelClassName?: string
	className?: string
}
const Embedded = ({ mainPanelClassName, className }: EmbeddedDevToolsProps) => {
	useTimelineHandler()
	useFindRouteOutlets()
	useSetRouteBoundaries()

	return (
		<div
			id={REACT_ROUTER_DEV_TOOLS}
			style={{
				height: "100%",
			}}
			className={clsx("react-router-dev-tools", "h-full flex-row w-full", className)}
		>
			<MainPanel className={mainPanelClassName} isEmbedded isOpen={true}>
				<Tabs />
				<ContentPanel />
			</MainPanel>
		</div>
	)
}

let hydrating = true

function useHydrated() {
	const [hydrated, setHydrated] = useState(() => !hydrating)

	useEffect(function hydrate() {
		hydrating = false
		setHydrated(true)
	}, [])

	return hydrated
}

const EmbeddedDevTools = ({ config, mainPanelClassName, className }: EmbeddedDevToolsProps) => {
	const hydrated = useHydrated()

	if (!hydrated) return null

	return (
		<RDTContextProvider config={config}>
			<RequestProvider>
				<Embedded mainPanelClassName={mainPanelClassName} className={className} />
			</RequestProvider>
		</RDTContextProvider>
	)
}

export { EmbeddedDevTools }
