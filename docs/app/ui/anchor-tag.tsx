import type { ComponentPropsWithoutRef } from "react"
import { cn } from "~/utils/css"

export const Anchor = (props: ComponentPropsWithoutRef<"a">) => {
	const { className, target, rel, ...rest } = props
	const safeRel = target === "_blank" ? (rel ?? "noopener noreferrer") : rel

	return <a {...rest} target={target} rel={safeRel} className={cn("text-[var(--color-text-normal)]", className)} />
}
