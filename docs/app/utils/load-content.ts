import type { Section } from "content-collections-types"
import type { Page } from "content-collections-types"
import { loadContentCollections } from "~/utils/load-content-collections"
import type { Version } from "~/utils/version-resolvers"
import { versions } from "./versions"

const content: Map<string, { allPages: Page[]; allSections: Section[] }> = new Map()

export async function preloadContentCollections() {
	for (const version of versions) {
		if (!content.has(version)) {
			const { allPages, allSections } = await loadContentCollections(version)
			content.set(version, { allPages, allSections })
		}
	}
}

export async function getContent(version: Version) {
	const contentForVersion = content.get(version)
	if (!contentForVersion) {
		throw new Error(`Content for version "${version}" could not be retrieved.`)
	}
	const { allPages, allSections } = await loadContentCollections(version)
	return { allPages, allSections }
}
