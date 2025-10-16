import clsx from "clsx"

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
	gap?: "sm" | "md" | "lg"
}

const GAPS = {
	sm: "gap-1",
	md: "gap-2",
	lg: "gap-4",
}

const Stack = ({ gap = "md", className, children, ...props }: StackProps) => {
	return (
		<div className={clsx("flex flex-col", GAPS[gap], className)} {...props}>
			{children}
		</div>
	)
}

export { Stack }
