import clsx from "clsx"
import type { ReactNode } from "react"

export const TAG_COLORS = {
	GREEN: "border-green-500 border border-solid text-white",
	BLUE: "border-blue-500 border border-solid text-white",
	TEAL: "border-teal-400 border border-solid text-white",
	RED: "border-red-500 border border-solid text-white",
	PURPLE: "border-purple-500 border border-solid text-white",
} as const

interface TagProps {
	color: keyof typeof TAG_COLORS
	children: ReactNode
	className?: string
}

const Tag = ({ color, children, className }: TagProps) => {
	return (
		<span className={clsx("flex items-center rounded px-2.5 py-0.5 text-sm font-medium", className, TAG_COLORS[color])}>
			{children}
		</span>
	)
}

export { Tag }
