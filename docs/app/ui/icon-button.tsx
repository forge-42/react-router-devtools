import type { ComponentProps } from "react"
import { cn } from "~/utils/css"
import { Icon } from "./icon/icon"
import type { IconName } from "./icon/icons/types"

interface IconButtonProps extends ComponentProps<"button"> {
	name: IconName
	className?: string
}

export const IconButton = ({ name, className, ...props }: IconButtonProps) => {
	return (
		<button
			type="button"
			className={cn(
				"group inline-flex cursor-pointer items-center justify-center rounded-full text-[var(--color-text-active)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border)] focus-visible:ring-offset-2",
				className
			)}
			{...props}
		>
			<Icon name={name} className={cn("size-4 transition-transform duration-300 xl:size-5", className)} />
		</button>
	)
}
