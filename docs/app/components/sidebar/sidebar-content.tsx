import { useMobileView } from "~/hooks/use-mobile-view"
import { Accordion } from "~/ui/accordion"
import type { SidebarTree } from "~/utils/create-sidebar-tree"
import { buildStandaloneTo } from "~/utils/path-builders"
import { useCurrentVersion } from "~/utils/version-resolvers"
import { DocumentationNavLink, SectionItem } from "./sidebar-items"

export const SidebarContent = ({
	sidebarTree,
	onClose,
}: {
	sidebarTree: SidebarTree
	onClose?: () => void
}) => {
	const { isMobile } = useMobileView()
	const handle = isMobile ? onClose : undefined
	const { sections, documentationPages } = sidebarTree
	const version = useCurrentVersion()
	return (
		<nav
			className="scrollbar max-h-[calc(100vh-var(--header-height))] min-h-0 flex-1 overflow-y-auto pr-4"
			aria-label="Documentation navigation"
		>
			{documentationPages.length > 0 && (
				<div className="mb-6 space-y-1">
					{documentationPages.map((p) => (
						<DocumentationNavLink
							key={p.slug}
							title={p.title}
							onClick={handle}
							to={buildStandaloneTo(version, p.slug)}
						/>
					))}
				</div>
			)}

			<Accordion>
				{sections.map((item) => (
					<SectionItem key={item.slug} item={item} onItemClick={handle} />
				))}
			</Accordion>
		</nav>
	)
}
