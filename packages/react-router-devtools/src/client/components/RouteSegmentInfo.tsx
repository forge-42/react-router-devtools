import type { UIMatch } from "react-router"
import { parseCacheControlHeader } from "../../server/parser.js"
import { type ServerRouteInfo, defaultServerRouteState } from "../context/rdtReducer.js"
import { useServerInfo, useSettingsContext } from "../context/useRDTContext.js"
import { useStyles } from "../styles/use-styles.js"
import { openSource } from "../utils/open-source.js"
import { isLayoutRoute } from "../utils/routing.js"
import { CacheInfo } from "./CacheInfo.js"
import { EditorButton } from "./EditorButton.js"
import { InfoCard } from "./InfoCard.js"
import { RouteSegmentBody } from "./RouteSegmentBody.js"
import { RouteSegmentCard } from "./RouteSegmentCard.js"
import { type RouteColor, RouteSegmentHeader } from "./RouteSegmentHeader.js"
import { Tag } from "./Tag.js"
import { Icon } from "./icon/Icon.js"
import { JsonRenderer } from "./jsonRenderer.js"

// biome-ignore lint/suspicious/noExplicitAny: we dont care about loader data
const getLoaderData = (data: string | Record<string, any>) => {
	if (typeof data === "string") {
		try {
			const temp = JSON.parse(data)

			return JSON.stringify(temp, null, 2)
		} catch (_e) {
			return data
		}
	}
	return data
}

const cleanupLoaderOrAction = (routeInfo: ServerRouteInfo["lastLoader"]) => {
	if (!Object.keys(routeInfo).length) return {}
	return {
		executionTime: `${routeInfo.executionTime}ms`,
		...(routeInfo.responseData ? { responseData: routeInfo.responseData } : {}),
		...(routeInfo.requestData ? { requestData: routeInfo.requestData } : {}),
		...(routeInfo.responseHeaders ? { responseHeaders: routeInfo.responseHeaders } : {}),
		...(routeInfo.requestHeaders ? { requestHeaders: routeInfo.requestHeaders } : {}),
		...(routeInfo.responseHeaders?.["cache-control"] && {
			cacheInfo: { ...parseCacheControlHeader(new Headers(routeInfo.responseHeaders)) },
		}),
	}
}

const cleanServerInfo = (routeInfo: ServerRouteInfo) => {
	return {
		loaderInfo: {
			loaderTriggerCount: routeInfo.loaderTriggerCount,
			lowestExecutionTime: `${routeInfo.lowestExecutionTime}ms`,
			highestExecutionTime: `${routeInfo.highestExecutionTime}ms`,
			averageExecutionTime: `${routeInfo.averageExecutionTime}ms`,
			lastLoaderInfo: cleanupLoaderOrAction(routeInfo.lastLoader),
			lastNLoaderCalls: routeInfo.loaders?.map((loader) => cleanupLoaderOrAction(loader)).reverse(),
		},
		actionInfo: {
			actionTriggerCount: routeInfo.actionTriggerCount,
			...(routeInfo.lastAction && {
				lastActionInfo: cleanupLoaderOrAction(routeInfo.lastAction),
			}),
			lastNActionCalls: routeInfo.actions?.map((action) => cleanupLoaderOrAction(action)).reverse(),
		},
		...cleanupLoaderOrAction(routeInfo.lastLoader),
	}
}

export const RouteSegmentInfo = ({ route, i }: { route: UIMatch<unknown, unknown>; i: number }) => {
	const { styles } = useStyles()
	const { server, setServerInfo } = useServerInfo()
	const isDev = typeof import.meta.hot !== "undefined"
	// biome-ignore lint/suspicious/noExplicitAny: we don't know or care about loader data type
	const loaderData = getLoaderData(route.loaderData ?? (route.data as any))
	const serverInfo = server?.routes?.[route.id]
	const isRoot = route.id === "root"
	const { setSettings, settings } = useSettingsContext()
	const cacheControl = serverInfo?.lastLoader.responseHeaders
		? parseCacheControlHeader(new Headers(serverInfo?.lastLoader.responseHeaders))
		: undefined
	const entryRoute = window.__reactRouterManifest?.routes[route.id]
	const isLayout = isLayoutRoute(entryRoute)

	const clearServerInfoForRoute = () => {
		const newServerInfo = { ...server?.routes }
		newServerInfo[route.id] = defaultServerRouteState
		setServerInfo({ routes: newServerInfo })
	}

	const routeColor: RouteColor = isRoot ? "purple" : isLayout ? "blue" : "green"
	const iconName: "Root" | "Layout" | "CornerDownRight" = isRoot ? "Root" : isLayout ? "Layout" : "CornerDownRight"

	const headerActions = (
		<div className={styles.routeSegmentCard.headerActions}>
			{isDev && import.meta.env.DEV && entryRoute?.module && (
				<EditorButton
					data-testid={`${route.id}-open-source`}
					onClick={() => {
						openSource(`${entryRoute.module}`)
					}}
				/>
			)}
			<button
				type="button"
				data-testid={`${route.id}-show-route-boundaries`}
				className={styles.routeSegmentInfo.showBoundaryButton}
				onClick={() => {
					const routeId = route.id === "root" ? "root" : i.toString()
					if (routeId !== settings.hoveredRoute) {
						// Remove the classes from the old hovered route
						setSettings({
							isHoveringRoute: false,
						})
						// Add the classes to the new hovered route
						setTimeout(() => {
							setSettings({
								hoveredRoute: routeId,
								isHoveringRoute: true,
							})
						})
					} else {
						// Just change the isHoveringRoute state
						setSettings({
							isHoveringRoute: !settings.isHoveringRoute,
						})
					}
				}}
			>
				<Icon name="Radio" size="sm" />
				Show Route Boundary
			</button>
		</div>
	)

	return (
		<RouteSegmentCard data-testid={route.id}>
			<RouteSegmentHeader
				icon={iconName}
				color={routeColor}
				title={route.pathname}
				subtitle={route.id}
				rightContent={headerActions}
			/>
			<RouteSegmentBody>
				{/* Cache Info */}
				{Boolean(cacheControl && serverInfo?.lastLoader.timestamp) && (
					<div className={styles.routeSegmentCard.cacheSection}>
						<CacheInfo
							key={JSON.stringify(serverInfo?.lastLoader ?? "")}
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							cacheControl={cacheControl!}
							cacheDate={new Date(serverInfo?.lastLoader.timestamp ?? "")}
						/>
					</div>
				)}

				{/* Component Tags */}
				<div className={styles.routeSegmentCard.componentsSection}>
					<span className={styles.routeSegmentCard.componentsSectionLabel}>Exports:</span>
					<div className={styles.routeSegmentCard.tagsContainer}>
						<Tag color={entryRoute?.hasLoader ? "GREEN" : "RED"}>Loader</Tag>
						<Tag color={entryRoute?.hasClientLoader ? "GREEN" : "RED"}>Client Loader</Tag>
						<Tag color={entryRoute?.hasClientAction ? "GREEN" : "RED"}>Client Action</Tag>
						<Tag color={entryRoute?.hasAction ? "GREEN" : "RED"}>Action</Tag>
						<Tag color={entryRoute?.hasErrorBoundary ? "GREEN" : "RED"}>ErrorBoundary</Tag>
					</div>
				</div>

				{/* Info Cards */}
				<div className={styles.routeSegmentCard.cardsContainer}>
					{loaderData && <InfoCard title="Returned loader data">{<JsonRenderer data={loaderData} />}</InfoCard>}
					{serverInfo && import.meta.env.DEV && (
						<InfoCard onClear={clearServerInfoForRoute} title="Server information">
							<JsonRenderer data={cleanServerInfo(serverInfo)} />
						</InfoCard>
					)}
					{route.params && Object.keys(route.params).length > 0 && (
						<InfoCard title="Route params">
							<JsonRenderer data={route.params} />
						</InfoCard>
					)}
					{Boolean(route.handle && Object.keys(route.handle).length > 0) && (
						<InfoCard title="Route handle">
							{/* biome-ignore lint/suspicious/noExplicitAny: we don't care about the type */}
							<JsonRenderer data={route.handle as any} />
						</InfoCard>
					)}
				</div>
			</RouteSegmentBody>
		</RouteSegmentCard>
	)
}
