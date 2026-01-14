import { useMemo } from "react"
import { useMatches, useRevalidator } from "react-router"

import { MemoizedRouteSegmentInfo } from "../components/RouteSegmentInfo.js"
import { TabContent } from "../components/TabContent.js"
import { TabHeader } from "../components/TabHeader.js"
import { Icon } from "../components/icon/Icon.js"
import { cx, useStyles } from "../styles/use-styles.js"

const PageTab = () => {
	const { styles } = useStyles()
	const routes = useMatches()
	const { revalidate, state } = useRevalidator()

	// Memoize reversed routes to avoid creating new array on every render
	const reversedRoutes = useMemo(() => [...routes.toReversed()], [routes])

	return (
		<>
			<TabHeader
				icon={<Icon name="Layers" />}
				title="Active Route Segments"
				rightContent={
					<button
						type="button"
						onClick={() => revalidate()}
						data-testid="revalidate-button"
						className={cx(styles.pageTab.revalidateButton, state !== "idle" && styles.pageTab.revalidateButtonDisabled)}
					>
						{state !== "idle" ? "Revalidating..." : "Revalidate"}
					</button>
				}
			/>
			<div className={styles.pageTab.content}>
				<TabContent>
					<ul className={cx(styles.pageTab.routesList, state === "loading" && styles.pageTab.routesListLoading)}>
						{reversedRoutes.map((route, i) => (
							<MemoizedRouteSegmentInfo route={route} i={i} key={route.id} />
						))}
					</ul>
				</TabContent>
			</div>
		</>
	)
}

export { PageTab }
