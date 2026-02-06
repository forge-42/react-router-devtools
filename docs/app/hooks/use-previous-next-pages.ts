import { href, useLocation } from "react-router"
import type { SidebarTree } from "~/utils/create-sidebar-tree"
import { flattenSidebarItems } from "~/utils/flatten-sidebar"
import { splitSlug } from "~/utils/split-slug"
import { useCurrentVersion } from "~/utils/version-resolvers"

function buildDocHref(slug: string, version: string) {
	const parts = slug.split("/").filter(Boolean)
	if (parts.length === 1) {
		const filename = parts[0]
		return href("/:version/:section?/:subsection?/:filename", { version, filename })
	}
	const { section, subsection, filename } = splitSlug(slug)
	return href("/:version/:section?/:subsection?/:filename", {
		version,
		section,
		subsection,
		filename,
	})
}

export function usePreviousNextPages(sidebarTree: SidebarTree) {
	const { pathname } = useLocation()
	const version = useCurrentVersion()
	const { sections, documentationPages } = sidebarTree

	const flatFromSections = flattenSidebarItems(sections)
	const flatStandalone = documentationPages.map((p) => ({ title: p.title, slug: p.slug }))
	const flatPages = [...flatStandalone, ...flatFromSections]

	const currentIndex = flatPages.findIndex((p) => pathname.endsWith(p.slug))

	const getNavItem = (index: number) => {
		const item = flatPages[index]
		if (!item) return undefined
		return {
			title: item.title,
			to: buildDocHref(item.slug, version),
		}
	}

	return {
		previous: getNavItem(currentIndex - 1),
		next: getNavItem(currentIndex + 1),
	}
}
