import type { UIMatch } from "react-router"
import { parseCacheControlHeader } from "../../server/parser.js"
import { type ServerRouteInfo, defaultServerRouteState } from "../context/rdtReducer.js"
import { useServerInfo, useSettingsContext } from "../context/useRDTContext.js"
import { cx, useStyles } from "../styles/use-styles.js"
import { openSource } from "../utils/open-source.js"
import { isLayoutRoute } from "../utils/routing.js"
import { CacheInfo } from "./CacheInfo.js"
import { EditorButton } from "./EditorButton.js"
import { InfoCard } from "./InfoCard.js"
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

const ROUTE_COLORS = {
	GREEN: "green",
	BLUE: "blue",
	TEAL: "teal",
	RED: "red",
	PURPLE: "purple",
} as const

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
	const onHover = (path: string, type: "enter" | "leave") => {
		if (settings.showRouteBoundariesOn === "click") {
			return
		}
		setSettings({
			hoveredRoute: path,
			isHoveringRoute: type === "enter",
		})
	}
	const entryRoute = window.__reactRouterManifest?.routes[route.id]
	const isLayout = isLayoutRoute(entryRoute)

	const clearServerInfoForRoute = () => {
		const newServerInfo = { ...server?.routes }
		newServerInfo[route.id] = defaultServerRouteState
		setServerInfo({ routes: newServerInfo })
	}

	const routeColor = isRoot ? ROUTE_COLORS.PURPLE : isLayout ? ROUTE_COLORS.BLUE : ROUTE_COLORS.GREEN

	return (
		<li
			data-testid={route.id}
			onMouseEnter={() => onHover(route.id === "root" ? "root" : i.toString(), "enter")}
			onMouseLeave={() => onHover(route.id === "root" ? "root" : i.toString(), "leave")}
			className={styles.routeSegmentInfo.listItem}
		>
			<div
				className={cx(
					styles.routeSegmentInfo.iconWrapper,
					styles.routeSegmentInfo[
						`iconWrapper${routeColor.charAt(0).toUpperCase() + routeColor.slice(1)}` as keyof typeof styles.routeSegmentInfo
					]
				)}
			>
				<Icon name={isRoot ? "Root" : isLayout ? "Layout" : "CornerDownRight"} size="sm" />
			</div>
			<h2 className={styles.routeSegmentInfo.header}>
				{route.pathname}

				<div className={styles.routeSegmentInfo.headerActions}>
					{Boolean(cacheControl && serverInfo?.lastLoader.timestamp) && (
						<CacheInfo
							key={JSON.stringify(serverInfo?.lastLoader ?? "")}
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							cacheControl={cacheControl!}
							cacheDate={new Date(serverInfo?.lastLoader.timestamp ?? "")}
						/>
					)}
					<div className={styles.routeSegmentInfo.actionButtons}>
						{isDev && import.meta.env.DEV && entryRoute?.module && (
							<EditorButton
								data-testid={`${route.id}-open-source`}
								onClick={() => {
									openSource(`${entryRoute.module}`)
								}}
							/>
						)}
						{settings.showRouteBoundariesOn === "click" && (
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
								Show Route Boundary
							</button>
						)}
					</div>
				</div>
			</h2>
			<div className={styles.routeSegmentInfo.content}>
				<p className={styles.routeSegmentInfo.routeFileLabel}>Route segment file: {route.id}</p>

				<div className={styles.routeSegmentInfo.cardsContainer}>
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
			</div>
		</li>
	)
}
