import type { Page } from "content-collections"
import type { SidebarSection } from "~/utils/create-sidebar-tree"
import { buildDocPathFromSlug } from "~/utils/path-builders"

export const buildBreadcrumbs = (
	items: SidebarSection[],
	pathname: string,
	documentationPages: Pick<Page, "title" | "slug">[] = []
) => {
	// for standalone pages: /:filename
	for (const page of documentationPages) {
		const docPath = buildDocPathFromSlug(page.slug)
		if (docPath === pathname) {
			return [page.title]
		}
	}

	// for sectioned pages: /:section/:subsection?/:filename
	let trail: string[] = []

	const walk = (section: SidebarSection, acc: string[]): boolean => {
		for (const doc of section.documentationPages) {
			const docPath = buildDocPathFromSlug(doc.slug)
			if (docPath === pathname) {
				trail = [...acc, section.title, doc.title]
				return true
			}
		}

		for (const sub of section.subsections) {
			if (walk(sub, [...acc, section.title])) return true
		}
		return false
	}

	for (const root of items) {
		if (walk(root, [])) break
	}

	return trail
}
