import type { Page } from "content-collections-types"
import { getContent } from "./load-content"
import type { Version } from "./version-resolvers"

export type SidebarTree = {
	sections: SidebarSection[]
	documentationPages: Page[]
}

export type SidebarSection = {
	title: string
	slug: string
	subsections: SidebarSection[]
	documentationPages: Page[]
}

const parentOf = (slug: string) => {
	const i = slug.lastIndexOf("/")
	return i === -1 ? "" : slug.slice(0, i)
}

export async function createSidebarTree(version: Version) {
	const { allPages, allSections } = await getContent(version)

	const sectionMap = new Map<string, SidebarSection>()
	for (const s of allSections) {
		sectionMap.set(s.slug, {
			...s,
			subsections: [],
			documentationPages: [],
		})
	}

	for (const node of sectionMap.values()) {
		const p = parentOf(node.slug)
		const parent = sectionMap.get(p)
		if (parent) parent.subsections.push(node)
	}

	const documentationPages: Page[] = []
	for (const page of allPages) {
		const parts = page.slug.split("/").filter(Boolean)

		if (parts.length < 2) {
			if (page.slug !== "index" && !page.slug.startsWith("_")) {
				documentationPages.push({ ...page, slug: page.slug, title: page.title })
			}
			continue
		}

		const parentSlug = parts.length >= 3 ? parts.slice(0, 2).join("/") : parts[0]
		const parent = sectionMap.get(parentSlug)
		if (parent) parent.documentationPages.push({ ...page, slug: page.slug, title: page.title })
	}

	const sections = [...sectionMap.values()].filter((s) => !sectionMap.has(parentOf(s.slug)))

	return { sections, documentationPages }
}
