import { useEffect, useRef, useState } from "react"
import { useFetcher } from "react-router"
import z from "zod"
import type { Version } from "~/utils/version-resolvers"
import { versions } from "~/utils/versions"
import type { SearchResult } from "../search-types"
import { useDebounce } from "./use-debounce"

export const commandKSearchParamsSchema = z.object({
	query: z.string(),
	version: z.enum(versions),
})

export type CommandKSearchParams = z.infer<typeof commandKSearchParamsSchema>

function createCommandKSearchParams(params: Record<string, string>) {
	const result = commandKSearchParamsSchema.safeParse(params)
	if (!result.success) {
		// biome-ignore lint/suspicious/noConsole: keep for debugging
		console.error("Invalid parameters:", result.error)
		return { params: null }
	}

	return { params: new URLSearchParams(result.data) }
}

const debounceMs = 250
const minChars = 1

export function useSearch({ version }: { version: Version }) {
	const fetcher = useFetcher<{ results: SearchResult[] }>()
	const [query, setQuery] = useState("")
	const debouncedQuery = useDebounce(query, debounceMs)
	const lastLoadedRef = useRef<string | null>(null)

	const results = query.trim() ? (fetcher.data?.results ?? []) : []

	function search(q: string) {
		setQuery(q)
	}

	useEffect(() => {
		const trimmed = debouncedQuery.trim()
		if (!trimmed || trimmed.length < minChars) {
			lastLoadedRef.current = null
			return
		}

		if (lastLoadedRef.current === trimmed) return
		lastLoadedRef.current = trimmed

		const { params } = createCommandKSearchParams({ query: trimmed, version })
		if (!params) return

		fetcher.load(`/search?${params.toString()}`)
	}, [debouncedQuery, version, fetcher])

	return {
		results,
		search,
	}
}
