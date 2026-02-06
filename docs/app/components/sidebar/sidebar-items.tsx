import { NavLink } from "react-router"
import { AccordionItem } from "~/ui/accordion"
import { buildSectionedTo } from "~/utils/path-builders"
import { useCurrentVersion } from "~/utils/version-resolvers"
import type { SidebarSection } from "./sidebar"

const getIndentClass = (depth: number) => {
	const indentMap = { 0: "ml-0", 1: "ml-4", 2: "ml-8" }
	return indentMap[depth as keyof typeof indentMap] || "ml-8"
}

type DocumentationNavLinkProps = {
	title: string
	to: string
	depth?: number
	onClick?: () => void
}

export function DocumentationNavLink({ title, to, depth = 0, onClick }: DocumentationNavLinkProps) {
	const indentClass = getIndentClass(depth)
	return (
		<NavLink
			prefetch="intent"
			to={to}
			onClick={onClick}
			className={({ isActive, isPending }) =>
				`block rounded-md px-3 py-2 text-sm md:text-base ${indentClass}
         ${isPending ? "text-[var(--color-text-hover)]" : ""}
         ${
						isActive
							? "bg-[var(--color-background-active)] font-medium text-[var(--color-text-active)]"
							: "text-[var(--color-text-normal)] hover:text-[var(--color-text-hover)]"
					}`
			}
		>
			{title}
		</NavLink>
	)
}

interface SectionItemProps {
	item: SidebarSection
	depth?: number
	onItemClick?: () => void
}

const SectionTitle = ({ title }: { title: string }) => {
	return (
		<h3 className="mb-3 px-3 font-semibold text-[var(--color-text-active)] text-base tracking-wide md:text-lg">
			{title}
		</h3>
	)
}

export const SectionItem = ({ item, depth = 0, onItemClick }: SectionItemProps) => {
	const isTopLevel = depth === 0
	const version = useCurrentVersion()
	const content = (
		<div>
			{item.documentationPages.length > 0 && (
				<div className="mb-4 space-y-1">
					{item.documentationPages.map((doc) => (
						<DocumentationNavLink
							key={doc.slug}
							title={doc.title}
							depth={depth}
							onClick={onItemClick}
							to={buildSectionedTo(version, doc.slug)}
						/>
					))}
				</div>
			)}

			{item.subsections.length > 0 && (
				<div className="space-y-4">
					{item.subsections.map((subsection) => (
						<SectionItem key={subsection.slug} item={subsection} depth={depth + 1} onItemClick={onItemClick} />
					))}
				</div>
			)}
		</div>
	)

	if (isTopLevel) {
		return (
			<AccordionItem
				title={item.title}
				titleElement="h4"
				titleClassName=" font-semibold tracking-wide text-[var(--color-text-active)]"
				content={content}
				defaultOpen={true}
			/>
		)
	}

	return (
		<div className="mb-6">
			<SectionTitle title={item.title} />
			{content}
		</div>
	)
}
