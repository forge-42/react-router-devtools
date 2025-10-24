import { useStyles } from "../styles/use-styles.js"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	id: string
	children: React.ReactNode
	value?: boolean
	hint?: string
}

const Checkbox = ({ onChange, id, children, value, hint, ...props }: CheckboxProps) => {
	const { styles } = useStyles()
	return (
		<div className={styles.checkbox.container}>
			<label className={styles.checkbox.label} htmlFor={id}>
				<div className={styles.checkbox.wrapper}>
					<input
						className={styles.checkbox.input}
						value={value ? "checked" : undefined}
						checked={value}
						onChange={onChange}
						id={id}
						type="checkbox"
						{...props}
					/>

					{children}
				</div>
			</label>
			{hint && <p className={styles.checkbox.hint}>{hint}</p>}
		</div>
	)
}

export { Checkbox }
