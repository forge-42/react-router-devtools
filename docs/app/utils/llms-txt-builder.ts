import { createDomain } from "~/utils/http"
import type { Page, Section } from "../../content-collections"
import { getContent } from "./load-content"
import { type Version, pageUrlWithVersion } from "./version-resolvers"

function buildSectionTitles(sections: Section[]) {
	return new Map(sections.map((s) => [s.slug.split("/").pop() || "", s.title]))
}

function groupPagesByFolder(pages: Page[]) {
	return pages.reduce((groups, p) => {
		const id = p.section ?? p._meta.path?.split("/")[0]
		if (!id) return groups
		const list = groups.get(id) ?? []
		if (!groups.has(id)) groups.set(id, list)
		list.push(p)
		return groups
	}, new Map<string, Page[]>())
}

function renderVersionBlock(domain: string, version: string, pages: Page[], sections: Section[]) {
	if (!pages.length) return `## ${version}\n\n_No pages found._`

	const sectionTitles = buildSectionTitles(sections)
	const groups = groupPagesByFolder(pages)

	const renderPageLink = (p: Page) => {
		const url = pageUrlWithVersion(domain, version, p.slug)
		const note = p.description
		return `- [${p.title}](${url})${note ? `: ${note}` : ""}`
	}

	const renderSection = ([id, list]: [string, Page[]]) => {
		const label = sectionTitles.get(id) ?? id
		return `### ${label}\n\n${list.map(renderPageLink).join("\n")}`
	}

	return `\n## ${version}\n\n${Array.from(groups.entries()).map(renderSection).join("\n\n")}`
}

export async function renderLlmsTxt(opts: {
	request: Request
	version: Version
	title: string
	tagline: string
}) {
	const { request, version, title, tagline } = opts
	const domain = createDomain(request)

	const { allPages, allSections } = await getContent(version)
	const content = renderVersionBlock(domain, version, allPages, allSections)

	return [`# ${title}`, `> ${tagline}`, content, ""].join("\n")
}
