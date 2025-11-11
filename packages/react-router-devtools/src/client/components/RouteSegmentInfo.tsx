import type { UIMatch } from "react-router"
import { convertBigIntToString } from "../../shared/bigint-util.js"
import { useSettingsContext } from "../context/useRDTContext.js"
import { useStyles } from "../styles/use-styles.js"
import { openSource } from "../utils/open-source.js"
import { isLayoutRoute } from "../utils/routing.js"
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
			// Convert BigInt values to strings before stringifying
			return JSON.stringify(convertBigIntToString(temp), null, 2)
		} catch (_e) {
			return data
		}
	}
	// Convert BigInt values to strings
	return convertBigIntToString(data)
}

export const RouteSegmentInfo = ({ route, i }: { route: UIMatch<unknown, unknown>; i: number }) => {
	const { styles } = useStyles()

	const isDev = typeof import.meta.hot !== "undefined"
	const entryRoute = window.__reactRouterManifest?.routes[route.id]
	// biome-ignore lint/suspicious/noExplicitAny: we don't know or care about loader data type
	const loaderData = getLoaderData(route.loaderData ?? (route.data as any))
	const isRoot = route.id === "root"
	const { setSettings, settings } = useSettingsContext()
	const isLayout = isLayoutRoute(entryRoute)

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
