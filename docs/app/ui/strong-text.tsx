import type { ComponentPropsWithoutRef } from "react"
import { cn } from "~/utils/css"

export const Strong = (props: ComponentPropsWithoutRef<"strong">) => {
	return <strong {...props} className={cn("text-[var(--color-text-normal)]", props.className)} />
}
