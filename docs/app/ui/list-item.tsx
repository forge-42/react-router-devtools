import type { ComponentPropsWithoutRef } from "react"
import { cn } from "~/utils/css"

export const ListItem = (props: ComponentPropsWithoutRef<"li">) => {
	return (
		<li
			{...props}
			className={cn(
				"space-y-1 pl-1 text-[var(--color-text-normal)] text-base leading-7 md:text-lg md:leading-8 xl:leading-8 xl:leading-9 [&>li]:ml-2 [&>li]:marker:font-medium",
				props.className
			)}
		/>
	)
}
