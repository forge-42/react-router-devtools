import { type ReactNode, useState } from "react"
import { cn } from "../utils/css"
import { Icon } from "./icon/icon"
import { Title, type ValidTitleElements } from "./title"

interface AccordionItemProps {
	title?: string
	titleElement?: keyof typeof ValidTitleElements
	titleClassName?: string
	content: ReactNode
	defaultOpen?: boolean
}

interface AccordionProps {
	children: ReactNode
	className?: string
}

const AccordionContent = ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) => {
	return (
		<div
			className={cn(
				"grid overflow-hidden transition-all duration-300 ease-in-out",
				isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
			)}
		>
			<div className="overflow-hidden p-1">{children}</div>
		</div>
	)
}

/**
 * An expandable and collapsible content section used within the `Accordion` component.
 *
 * The title is rendered using the `Title` component and can be customized via `titleElement`
 * (e.g. `"h2"`, `"h3"`, etc.) and styled with `titleClassName`.
 * Content visibility toggles when the heading is clicked. Supports smooth transitions.
 *
 * @param title - The heading text for the accordion item.
 * @param titleElement - The HTML heading element tag to render (`h1` through `h5`).
 * @param titleClassName - Optional classes to customize the title's appearance.
 * @param content - The content to show/hide when toggling the accordion.
 * @param defaultOpen - Whether the item should be open by default.
 *
 * @example
 * ```tsx
 * <AccordionItem
 *   title="Installation"
 *   titleElement="h4"
 *   content={
 *     <ul>
 *       <li>Run `npm install`</li>
 *       <li>Configure your environment</li>
 *     </ul>
 *   }
 * />
 * ```
 */
export const AccordionItem = ({
	title,
	titleElement,
	titleClassName,
	content,
	defaultOpen = false,
}: AccordionItemProps) => {
	const [isOpen, setIsOpen] = useState(defaultOpen)

	const buttonClasses =
		"flex gap-2 items-center w-full p-2 transition-transform duration-200 text-[var(--color-text-normal)] hover:text-[var(--color-text-hover)] hover:cursor-pointer rounded-md"

	const iconClasses = "w-4 h-4 transition-transform duration-300"

	return (
		<div>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents:we don't need key with click events */}
			<div className={buttonClasses} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
				<Icon name="ChevronDown" className={cn(iconClasses, isOpen && "rotate-180")} />
				<Title as={titleElement ?? "h5"} className={titleClassName}>
					{title}
				</Title>
			</div>
			<AccordionContent isOpen={isOpen}>{content}</AccordionContent>
		</div>
	)
}

/**
 * A container component for grouping multiple `AccordionItem`s.
 * Typically used to structure expandable sections of content.
 *
 * @param children - The `AccordionItem` components to render inside the accordion.
 * @param className - Optional additional classes for the accordion wrapper.
 *
 * @example
 * ```tsx
 * <Accordion>
 *   <AccordionItem
 *     title="What is this?"
 *     content={<p>This is an accordion item.</p>}
 *   />
 *   <AccordionItem
 *     title="Why use it?"
 *     content={<p>To toggle sections of content easily.</p>}
 *     defaultOpen
 *   />
 * </Accordion>
 * ```
 */
export const Accordion = ({ children, className }: AccordionProps) => {
	return <div className={className}>{children}</div>
}
