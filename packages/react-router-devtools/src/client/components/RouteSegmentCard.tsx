import type { ReactNode } from "react"
import { useStyles } from "../styles/use-styles.js"

interface RouteSegmentCardProps {
	children: ReactNode
	onMouseEnter?: () => void
	onMouseLeave?: () => void
	"data-testid"?: string
}

const RouteSegmentCard = ({
	children,
	onMouseEnter,
	onMouseLeave,
	"data-testid": dataTestId,
}: RouteSegmentCardProps) => {
	const { styles } = useStyles()

	return (
		<li
			data-testid={dataTestId}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className={styles.routeSegmentCard.item}
		>
			{children}
		</li>
	)
}

export { RouteSegmentCard }
