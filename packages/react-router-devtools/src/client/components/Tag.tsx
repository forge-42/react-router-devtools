import type { ReactNode } from "react"
import { cx, useStyles } from "../styles/use-styles.js"

export const TAG_COLORS = {
	GREEN: "GREEN",
	BLUE: "BLUE",
	TEAL: "TEAL",
	RED: "RED",
	PURPLE: "PURPLE",
} as const

interface TagProps {
	color: keyof typeof TAG_COLORS
	children: ReactNode
	className?: string
}

const Tag = ({ color, children, className }: TagProps) => {
	const { styles } = useStyles()
	return (
		<span
			className={cx(styles.tag.base, styles.tag[color.toLowerCase() as Lowercase<keyof typeof TAG_COLORS>], className)}
		>
			{children}
		</span>
	)
}

export { Tag }
