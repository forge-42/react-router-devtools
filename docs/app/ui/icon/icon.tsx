import type { SVGProps } from "react"
import { cn } from "~/utils/css"
import spriteHref from "./icons/icon.svg"
import type { IconName } from "./icons/types"

enum IconSize {
	xs = "12",
	sm = "16",
	md = "24",
	lg = "32",
	xl = "40",
}

type IconSizes = keyof typeof IconSize

interface IconProps extends SVGProps<SVGSVGElement> {
	name: IconName
	testId?: string
	className?: string
	size?: IconSizes
}

/**
 * Icon component wrapper for SVG icons.
 * @returns SVG icon as a react component
 */
export const Icon = ({ name, testId, className, size = "md", ...props }: IconProps) => {
	const iconSize = IconSize[size]
	const iconClasses = cn("inline-block flex-shrink-0", className)
	return (
		<svg
			className={iconClasses}
			fill={"currentColor"}
			stroke={"currentColor"}
			width={iconSize}
			height={iconSize}
			data-testid={testId}
			data-name={name}
			{...props}
		>
			<title>{name}</title>
			<use href={`${spriteHref}#${name}`} />
		</svg>
	)
}
