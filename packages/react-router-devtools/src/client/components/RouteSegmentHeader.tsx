import type { ReactNode } from "react"
import { cx, useStyles } from "../styles/use-styles.js"
import { Icon } from "./icon/Icon.js"

type RouteColor = "green" | "blue" | "teal" | "red" | "purple"

interface RouteSegmentHeaderProps {
	icon: "Root" | "Layout" | "CornerDownRight"
	color: RouteColor
	title: string
	subtitle?: string
	rightContent?: ReactNode
}

const RouteSegmentHeader = ({ icon, color, title, subtitle, rightContent }: RouteSegmentHeaderProps) => {
	const { styles } = useStyles()

	return (
		<div className={styles.routeSegmentCard.header}>
			<div
				className={cx(
					styles.routeSegmentCard.icon,
					styles.routeSegmentCard[
						`icon${color.charAt(0).toUpperCase() + color.slice(1)}` as keyof typeof styles.routeSegmentCard
					]
				)}
			>
				<Icon name={icon} size="sm" />
			</div>
			<h2 className={styles.routeSegmentCard.title}>
				{title}
				{subtitle && <span className={styles.routeSegmentCard.subtitle}> ({subtitle})</span>}
			</h2>
			{rightContent && <div className={styles.routeSegmentCard.headerActions}>{rightContent}</div>}
		</div>
	)
}

export { RouteSegmentHeader }
export type { RouteColor }
