import clsx from "clsx"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	hint?: string
}

export const Label = ({ className, children, ...props }: React.HTMLProps<HTMLLabelElement>) => {
	return (
		<label htmlFor={props.name} className={clsx("block text-white text-sm", className)} {...props}>
			{children}
		</label>
	)
}

export const Hint = ({ children }: React.HTMLProps<HTMLParagraphElement>) => {
	return <p className="text-sm text-gray-500">{children}</p>
}

const Input = ({ className, name, label, hint, ...props }: InputProps) => {
	return (
		<div className="flex w-full flex-col gap-1">
			{label && <Label htmlFor={name}>{label}</Label>}
			<input
				name={name}
				id={name}
				className={clsx(
					"w-full rounded transition-all text-white border border-gray-400 hover:border-gray-400/50 bg-[#121212] px-2 py-1 text-sm",
					className
				)}
				{...props}
			/>
			{hint && <Hint>{hint}</Hint>}
		</div>
	)
}

export { Input }
