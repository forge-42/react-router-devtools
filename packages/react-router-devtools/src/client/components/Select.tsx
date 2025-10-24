import * as SelectPrimitive from "@radix-ui/react-select"

import { cx, useStyles } from "../styles/use-styles.js"
import { Hint, Label } from "./Input.js"
import { Stack } from "./Stack.js"
import { Icon } from "./icon/Icon.js"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
const SelectTrigger = ({ className, children, ref, ...props }: SelectPrimitive.SelectTriggerProps & { ref?: any }) => {
	const { styles } = useStyles()
	return (
		<SelectPrimitive.Trigger ref={ref} className={cx(styles.select.trigger, className)} {...props}>
			{children}
			<SelectPrimitive.Icon asChild>
				<Icon name="ChevronDown" className={styles.select.icon} />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	)
}

const SelectContent = ({
	className,
	children,
	position = "popper",
	ref,
	...props
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
}: SelectPrimitive.SelectContentProps & { ref?: any }) => {
	const { styles } = useStyles()
	return (
		// @ts-ignore
		<SelectPrimitive.Portal className="react-router-dev-tools">
			<SelectPrimitive.Content
				ref={ref}
				className={cx(styles.select.content, position === "popper" && styles.select.contentPopper, className)}
				position={position}
				{...props}
			>
				<SelectPrimitive.Viewport
					className={cx(styles.select.viewport, position === "popper" && styles.select.viewportPopper)}
				>
					{children}
				</SelectPrimitive.Viewport>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	)
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
const SelectLabel = ({ className, ref, ...props }: SelectPrimitive.SelectLabelProps & { ref?: any }) => {
	const { styles } = useStyles()
	return <SelectPrimitive.Label ref={ref} className={cx(styles.select.label, className)} {...props} />
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
const SelectItem = ({ className, children, ref, ...props }: SelectPrimitive.SelectItemProps & { ref?: any }) => {
	const { styles } = useStyles()
	return (
		<SelectPrimitive.Item ref={ref} className={cx(styles.select.item, className)} {...props}>
			<span className={styles.select.itemIndicatorWrapper}>
				<SelectPrimitive.ItemIndicator>
					<Icon name="Check" className={styles.select.itemIndicatorIcon} />
				</SelectPrimitive.ItemIndicator>
			</span>

			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	)
}

const SelectWithOptions = <T extends string>({
	placeholder,
	label,
	options,
	onSelect,
	hint,
	value,
	className,
}: {
	placeholder?: string
	value?: T
	label?: string
	hint?: string
	options: { value: T; label: string }[]
	onSelect: (value: T) => void
	className?: string
}) => {
	const { styles } = useStyles()
	return (
		<Stack className={className} gap="sm">
			{label && <Label>{label}</Label>}
			<Select
				onOpenChange={() => {
					const el = document.querySelector("div[data-radix-popper-content-wrapper]")
					el?.setAttribute("class", "react-router-dev-tools")
				}}
				value={value}
				onValueChange={onSelect}
			>
				<SelectTrigger className={styles.select.triggerWithText}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>{label}</SelectLabel>
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{hint && <Hint>{hint}</Hint>}
		</Stack>
	)
}

export { SelectWithOptions }
