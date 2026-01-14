import { type ReactNode, memo } from "react"
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
	size?: "small" | "default"
}

const Tag = memo(({ color, children, className, size = "default" }: TagProps) => {
	const { styles } = useStyles()
	return (
		<span
			className={cx(
				styles.tag.base,
				size === "small" && styles.tag.small,
				styles.tag[color.toLowerCase() as Lowercase<keyof typeof TAG_COLORS>],
				className
			)}
		>
			{children}
		</span>
	)
})

export { Tag }
