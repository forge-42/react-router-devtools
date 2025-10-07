import type { ReactNode } from "react"
import { cn } from "~/utils/css"

export function Kbd({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<kbd
			className={cn(
				"rounded border border-[var(--color-kbd-border)] bg-[var(--color-kbd-bg)] px-1.5 py-0.5 font-mono",
				className
			)}
		>
			{children}
		</kbd>
	)
}
