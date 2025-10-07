import type { ComponentPropsWithoutRef } from "react"
import { cn } from "~/utils/css"

export const ListItem = (props: ComponentPropsWithoutRef<"li">) => {
	return (
		<li
			{...props}
			className={cn(
				"space-y-1 pl-1 text-[var(--color-text-normal)] text-sm leading-6 sm:text-base md:text-lg xl:leading-8 [&>li]:ml-2 [&>li]:marker:font-medium",
				props.className
			)}
		/>
	)
}
