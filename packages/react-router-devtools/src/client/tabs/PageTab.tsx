import { useMatches, useRevalidator } from "react-router"

import { RouteSegmentInfo } from "../components/RouteSegmentInfo.js"
import { cx, useStyles } from "../styles/use-styles.js"

const PageTab = () => {
	const { styles } = useStyles()
	const routes = useMatches()
	const { revalidate, state } = useRevalidator()

	return (
		<>
			<div className={styles.pageTab.header}>
				<div className={styles.pageTab.headerContent}>
					<div className={styles.pageTab.title}>Active Route Segments</div>
					<button
						type="button"
						onClick={() => revalidate()}
						data-testid="revalidate-button"
						className={cx(styles.pageTab.revalidateButton, state !== "idle" && styles.pageTab.revalidateButtonDisabled)}
					>
						{state !== "idle" ? "Revalidating..." : "Revalidate"}
					</button>
				</div>
				<hr className={styles.pageTab.divider} />
			</div>
			<div className={styles.pageTab.content}>
				<ol className={cx(styles.pageTab.routesList, state === "loading" && styles.pageTab.routesListLoading)}>
					{routes.toReversed().map((route, i) => (
						<RouteSegmentInfo route={route} i={i} key={route.id} />
					))}
				</ol>
			</div>
		</>
	)
}

export { PageTab }
