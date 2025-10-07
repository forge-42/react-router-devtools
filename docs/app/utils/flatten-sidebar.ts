import type { SidebarSection } from "~/components/sidebar/sidebar"

export function flattenSidebarItems(sections: SidebarSection[]) {
	const collectPages = (section: SidebarSection): { title: string; slug: string }[] => [
		...section.documentationPages,
		...section.subsections.flatMap(collectPages),
	]

	return sections.flatMap(collectPages)
}
