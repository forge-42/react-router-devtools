import { Children, type ReactNode, isValidElement } from "react"
import { Link } from "react-router"
import { cn } from "../utils/css"
import { Icon } from "./icon/icon"

interface BreadcrumbsProps {
	children: ReactNode
	className?: string
}

interface BreadcrumbItemProps {
	children: ReactNode
	href?: string
	isActive?: boolean
	className?: string
}

export const BreadcrumbItem = ({ children, href, isActive = false, className }: BreadcrumbItemProps) => {
	const classes = cn(
		"text-ellipsis text-start font-medium text-[var(--color-text-normal)]",
		isActive && "pointer-events-none font-semibold text-[var(--color-text-active)]",
		className
	)

	if (href && !isActive) {
		return (
			<Link to={href} className={classes}>
				{children}
			</Link>
		)
	}

	return (
		<span className={cn("block text-ellipsis text-start text-[var(--color-text-normal)]", className)}>{children}</span>
	)
}

export const Breadcrumbs = ({ children, className }: BreadcrumbsProps) => {
	const items = Children.toArray(children).filter(
		(child) => isValidElement(child) && child.type === BreadcrumbItem
	) as React.ReactElement<BreadcrumbItemProps>[]

	return (
		<nav aria-label="Breadcrumbs" className={cn(className)}>
			<ol className="inline-flex items-center">
				{items.map((child, index) => (
					<li key={child.props.href || index} className="flex items-center">
						{index > 0 && <Icon name="ChevronRight" className="size-5 shrink-0 px-1 text-[var(--color-text-muted)]" />}
						{child}
					</li>
				))}
			</ol>
		</nav>
	)
}
