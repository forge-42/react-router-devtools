import type { ReactNode } from "react"
import { useStyles } from "../styles/use-styles.js"

interface RouteSegmentBodyProps {
	children: ReactNode
}

const RouteSegmentBody = ({ children }: RouteSegmentBodyProps) => {
	const { styles } = useStyles()

	return <div className={styles.routeSegmentCard.body}>{children}</div>
}

export { RouteSegmentBody }
