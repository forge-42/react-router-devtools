import { cx, useStyles } from "../styles/use-styles.js"

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
	gap?: "sm" | "md" | "lg"
}

const Stack = ({ gap = "md", className, children, ...props }: StackProps) => {
	const { styles } = useStyles()
	return (
		<div className={cx(styles.stack.base, styles.stack[gap], className)} {...props}>
			{children}
		</div>
	)
}

export { Stack }
