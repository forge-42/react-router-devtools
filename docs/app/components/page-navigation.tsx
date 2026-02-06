import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { Icon } from "~/ui/icon/icon"
import { cn } from "~/utils/css"

interface PageNavigationItem {
	title: string
	to: string
}

interface PageNavigationProps {
	previous?: PageNavigationItem
	next?: PageNavigationItem
}

interface PageNavigationLinkProps {
	item: PageNavigationItem
	direction: "previous" | "next"
	label: string
}

function PageNavigationLink({ item, direction, label }: PageNavigationLinkProps) {
	const isPrevious = direction === "previous"

	return (
		<div className={clsx({ "text-right": !isPrevious })}>
			<div className="font-semibold text-[var(--color-text-active)]">{label}</div>
			<Link
				to={item.to}
				prefetch="intent"
				{...(direction === "next" && { viewTransition: true })}
				className={cn(
					"inline-flex items-center gap-1 rounded-md px-2 py-1 text-[var(--color-text-active)] text-sm no-underline transition-transform duration-200 ease-in-out hover:transform hover:text-[color:var(--color-text-hover)] sm:text-base md:gap-1.5 md:text-lg",
					isPrevious ? "-ml-2" : "-mr-2"
				)}
			>
				{isPrevious && <Icon name="ArrowLeft" aria-hidden="true" className="size-3 md:size-4" />}
				{item.title}
				{!isPrevious && <Icon name="ArrowRight" aria-hidden="true" className="size-3 md:size-4" />}
			</Link>
		</div>
	)
}

/**
 * A pagination navigation component that displays "Previous" and "Next" links with
 * accessible labels, styled arrows, and localized link text.
 *
 * It accepts optional `previous` and `next` props, each containing a `title` and `to` URL.
 * When present, the component renders navigational links with arrow indicators.
 *
 * Example usage:
 * <PageNavigation
 *   previous={{ title: "Getting Started", to: "/getting-started" }}
 *   next={{ title: "Advanced Topics", to: "/advanced-topics" }}
 * />
 *
 * @param previous - Optional previous page link data with title and path.
 * @param next - Optional next page link data with title and path.
 */
export function PageNavigation({ previous, next }: PageNavigationProps) {
	const { t } = useTranslation()

	return (
		<nav
			className="mt-12 flex items-start justify-between border-[var(--color-border)] border-t pt-6 text-[var(--color-text-active)] text-sm md:text-base"
			aria-label="Pagination navigation"
		>
			{previous ? <PageNavigationLink item={previous} direction="previous" label={t("links.previous")} /> : <div />}

			{next ? <PageNavigationLink item={next} direction="next" label={t("links.next")} /> : <div />}
		</nav>
	)
}
