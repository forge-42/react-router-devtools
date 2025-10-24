import { cx, useStyles } from "../styles/use-styles.js"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	hint?: string
}

export const Label = ({ className, children, ...props }: React.HTMLProps<HTMLLabelElement>) => {
	const { styles } = useStyles()
	return (
		<label htmlFor={props.name} className={cx(styles.input.label, className)} {...props}>
			{children}
		</label>
	)
}

export const Hint = ({ children }: React.HTMLProps<HTMLParagraphElement>) => {
	const { styles } = useStyles()
	return <p className={styles.input.hint}>{children}</p>
}

const Input = ({ className, name, label, hint, ...props }: InputProps) => {
	const { styles } = useStyles()
	return (
		<div className={styles.input.container}>
			{label && <Label htmlFor={name}>{label}</Label>}
			<input name={name} id={name} className={cx(styles.input.input, className)} {...props} />
			{hint && <Hint>{hint}</Hint>}
		</div>
	)
}

export { Input }
