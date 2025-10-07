import { commandKSearchParamsSchema } from "~/components/command-k/hooks/use-search"
import { fuzzySearch } from "~/server/search-index"
import { parseSearchParams } from "~/utils/parse-search-params"
import type { Route } from "./+types/search"

export async function loader({ request }: Route.LoaderArgs) {
	const { params } = parseSearchParams(request, commandKSearchParamsSchema)
	if (!params) {
		throw new Response("Bad Request", { status: 400 })
	}

	const { query, version } = params
	if (!query) {
		return { results: [] }
	}

	try {
		const results = await fuzzySearch({ query: query.trim(), version })
		return {
			results,
		}
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: keep for debugging
		console.error("Search error:", error)
		return { results: [] }
	}
}
