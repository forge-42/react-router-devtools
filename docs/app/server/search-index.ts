import { createSearchIndex } from "~/components/command-k/create-search-index"
import { useFuzzySearch } from "~/components/command-k/hooks/use-fuzzy-search"
import type { CommandKSearchParams } from "~/components/command-k/hooks/use-search"
import type { SearchRecord } from "~/components/command-k/search-types"
import { loadContentCollections } from "~/utils/load-content-collections"
import type { Version } from "~/utils/version-resolvers"
import { versions } from "~/utils/versions"

const searchIndexes: Map<string, SearchRecord[]> = new Map()

export async function preloadSearchIndexes() {
	await Promise.all(
		versions.map(async (version) => {
			if (!searchIndexes.has(version)) {
				const { allPages } = await loadContentCollections(version)
				const searchIndex = createSearchIndex(allPages)

				searchIndexes.set(version, searchIndex)
			}
		})
	)
}

async function getSearchIndex(version: Version) {
	const index = searchIndexes.get(version)
	if (!index) {
		throw new Error(`Search index for version "${version}" could not be retrieved.`)
	}

	return index
}

export async function fuzzySearch({ query, version }: CommandKSearchParams) {
	const searchIndex = await getSearchIndex(version)
	return useFuzzySearch(searchIndex, query)
}
