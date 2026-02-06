import * as AccordionPrimitive from "@radix-ui/react-accordion"
import * as React from "react"

import { cx, useStyles } from "../styles/use-styles.js"
import { Icon } from "./icon/Icon.js"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
	const { styles } = useStyles()
	return <AccordionPrimitive.Item ref={ref} className={cx(styles.accordion.item, className)} {...props} />
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
	const { styles } = useStyles()
	return (
		<AccordionPrimitive.Header className={styles.accordion.header}>
			<AccordionPrimitive.Trigger ref={ref} className={cx(styles.accordion.trigger, className)} {...props}>
				{children}
				<Icon className={styles.accordion.icon} name="ChevronDown" />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	)
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
	const { styles } = useStyles()
	return (
		<AccordionPrimitive.Content ref={ref} className={cx(styles.accordion.content, className)} {...props}>
			<div className={styles.accordion.contentInner}>{children}</div>
		</AccordionPrimitive.Content>
	)
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
