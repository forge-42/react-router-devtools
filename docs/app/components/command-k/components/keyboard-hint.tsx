import { Kbd } from "~/ui/kbd"
import { cn } from "~/utils/css"

interface KeyboardHintProps {
	keys: string | string[]
	label: string
	className?: string
}

export const KeyboardHint = ({ keys, label, className }: KeyboardHintProps) => {
	const keyArray = Array.isArray(keys) ? keys : [keys]

	return (
		<div className={cn("flex items-center gap-1", className)}>
			{keyArray.map((key) => (
				<Kbd key={key}>{key}</Kbd>
			))}
			<span>{label}</span>
		</div>
	)
}
