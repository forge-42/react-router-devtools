import type { ComponentPropsWithoutRef } from "react"
import { cn } from "~/utils/css"

/**
 * A styled wrapper around the native <ol> element, used to render ordered lists
 * with consistent spacing, indentation, and text styling.
 *
 * Example usage:
 * <OrderedList>
 *   <li>Clone the repository</li>
 *   <li>Install dependencies</li>
 *   <li>Run the development server</li>
 * </OrderedList>
 */
export const OrderedList = (props: ComponentPropsWithoutRef<"ol">) => {
	return (
		<ol
			{...props}
			className={cn(
				"list-decimal space-y-1 pl-4 text-[var(--color-text-normal)] [&>li]:ml-2 [&>li]:marker:font-medium ",
				props.className
			)}
		/>
	)
}
