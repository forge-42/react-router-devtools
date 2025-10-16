import { cn } from "~/utils/css"

interface HeaderProps {
	children: React.ReactNode
	className?: string
}

export const Header = ({ children, className }: HeaderProps) => {
	return (
		<header
			className={cn(
				"sticky top-0 z-50 flex w-full items-center justify-between border-[var(--color-border)] border-b bg-[var(--color-background)] px-4 py-4 lg:px-8",
				className
			)}
		>
			{children}
		</header>
	)
}
