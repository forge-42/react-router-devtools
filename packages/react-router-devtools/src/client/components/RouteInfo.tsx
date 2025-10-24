import type { MouseEvent } from "react"
import { Link } from "react-router"
import { useSettingsContext } from "../context/useRDTContext.js"
import { cx, useStyles } from "../styles/use-styles.js"
import { type ExtendedRoute, constructRoutePath } from "../utils/routing.js"
import { findParentErrorBoundary } from "../utils/sanitize.js"
import { Input } from "./Input.js"
import { Tag } from "./Tag.js"
import { Icon } from "./icon/Icon.js"

interface RouteInfoProps {
	route: ExtendedRoute
	className?: string
	openNewRoute: (path: string) => (e?: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
	onClose?: () => void
}

export const RouteInfo = ({ route: routeToUse, className, openNewRoute, onClose }: RouteInfoProps) => {
	const { styles } = useStyles()
	const route = window.__reactRouterManifest?.routes[routeToUse.id] || routeToUse
	const { settings, setSettings } = useSettingsContext()
	const { routeWildcards, routeViewMode } = settings
	const { hasWildcard, path, pathToOpen } = constructRoutePath(routeToUse, routeWildcards)
	const isTreeView = routeViewMode === "tree"
	const { hasErrorBoundary, errorBoundaryId } = findParentErrorBoundary(route)
	const hasParentErrorBoundary = errorBoundaryId && errorBoundaryId !== route.id

	return (
		<div className={cx(className, styles.routeInfoComponent.container)}>
			{isTreeView && (
				<>
					<Icon onClick={onClose} className={styles.routeInfoComponent.closeIcon} name="X" />

					<h1 className={styles.routeInfoComponent.title}>{routeToUse.url}</h1>
					<hr className={styles.routeInfoComponent.divider} />
					<h3>
						<span className={styles.routeInfoComponent.label}>Path:</span>
						<span className={styles.routeInfoComponent.value}> {path}</span>
					</h3>
					<h3>
						<span className={styles.routeInfoComponent.label}>Url:</span>{" "}
						<span className={styles.routeInfoComponent.value}>{pathToOpen}</span>
					</h3>
				</>
			)}
			<div className={styles.routeInfoComponent.routeFile}>
				<span className={styles.routeInfoComponent.routeFileLabel}>Route file:</span>
				{route.module ?? routeToUse.file}
			</div>

			<div className={styles.routeInfoComponent.componentsSection}>
				<span className={styles.routeInfoComponent.label}>Components contained in the route:</span>
				<div className={styles.routeInfoComponent.tagsContainer}>
					<Tag className={styles.routeInfoComponent.tagHeight} color={route.hasLoader ? "GREEN" : "RED"}>
						Loader
					</Tag>
					<Tag className={styles.routeInfoComponent.tagHeight} color={route.hasClientLoader ? "GREEN" : "RED"}>
						Client Loader
					</Tag>
					<Tag className={styles.routeInfoComponent.tagHeight} color={route.hasClientAction ? "GREEN" : "RED"}>
						Client Action
					</Tag>
					<Tag className={styles.routeInfoComponent.tagHeight} color={route.hasAction ? "GREEN" : "RED"}>
						Action
					</Tag>

					<Tag
						className={cx(
							styles.routeInfoComponent.tagHeight,
							hasErrorBoundary && styles.routeInfoComponent.tagNoRightRadius
						)}
						color={hasErrorBoundary ? "GREEN" : "RED"}
					>
						ErrorBoundary
					</Tag>
				</div>
				{hasErrorBoundary ? (
					<div className={styles.routeInfoComponent.errorBoundaryMessage}>
						{hasParentErrorBoundary ? `Covered by parent ErrorBoundary located in: ${errorBoundaryId}` : ""}
					</div>
				) : null}
			</div>
			{hasWildcard && (
				<>
					<p className={styles.routeInfoComponent.wildcardLabel}>Wildcard parameters:</p>
					<div
						className={cx(
							styles.routeInfoComponent.wildcardGrid,
							isTreeView && styles.routeInfoComponent.wildcardGridSingleColumn
						)}
					>
						{routeToUse.url
							.split("/")
							.filter((p) => p.startsWith(":"))
							.map((param) => (
								<div key={param} className={styles.routeInfoComponent.wildcardInputWrapper}>
									<Tag key={param} color="BLUE">
										{param}
									</Tag>
									<Input
										value={routeWildcards[route.id]?.[param] || ""}
										onChange={(e) =>
											setSettings({
												routeWildcards: {
													...routeWildcards,
													[route.id]: {
														...routeWildcards[route.id],
														[param]: e.target.value,
													},
												},
											})
										}
										placeholder={param}
									/>
								</div>
							))}
					</div>
				</>
			)}
			{isTreeView && (
				<button type="button" className={styles.routeInfoComponent.openBrowserButton} onClick={openNewRoute(path)}>
					<Link className={styles.routeInfoComponent.openBrowserLink} to={path}>
						Open in browser
					</Link>
				</button>
			)}
		</div>
	)
}
