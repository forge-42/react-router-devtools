import { cn } from "../utils/css"

export const ValidTitleElements = {
	h1: "text-2xl sm:text-3xl md:text-4xl",
	h2: "text-xl sm:text-2xl md:text-3xl",
	h3: "text-lg sm:text-xl md:text-2xl",
	h4: "text-base sm:text-lg md:text-xl",
	h5: "text-sm sm:text-base md:text-lg",
	h6: "text-xs sm:text-sm md:text-base",
} as const

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode
	as: keyof typeof ValidTitleElements
	className?: string
}

/**
 * A reusable, styled heading component for consistent typography across the project.
 *
 * The `Title` component renders a heading element (`h1` through `h6`) with
 * predefined responsive font sizes, weights, and line heights based on a design scale.
 * It ensures consistent visual hierarchy and styling throughout the app.
 *
 * You can customize the appearance further using the `className` prop, and the rendered
 * element type is controlled via the `as` prop.
 *
 * @param as - The HTML heading element to render (`h1` through `h6`). Required.
 * @param children - The title content to display inside the heading.
 * @param className - Optional additional Tailwind or custom classes to override or extend the default styles.
 * @param props - Any additional valid HTML attributes for the heading element.
 *
 * @example
 * ```tsx
 * <Title as="h2" className="mb-4">
 *   Getting Started
 * </Title>
 * ```
 *
 * @returns A JSX element with consistent project-specific title styling.
 */
const Title = ({ children, as, className, ...props }: TitleProps) => {
	const Component = as
	const titleClasses = cn(ValidTitleElements[as], "text-[var(--color-text-normal)]", className)

	return (
		<Component {...props} className={titleClasses}>
			{children}
		</Component>
	)
}

export { Title }
