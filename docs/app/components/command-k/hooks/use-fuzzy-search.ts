import type { FuzzySearchOptions, SearchRecord, SearchResult } from "../search-types"

const DEFAULTS = {
	threshold: 0.8, // results must score ≥ 0.8 to be considered relevant
	minMatchCharLength: 2, // queries shorter than 2 chars are ignored
}

const clamp = (n: number, min: number, max: number) => (n < min ? min : n > max ? max : n)
const toSearchable = (s: string) => s.toLowerCase().trim()
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const scoreMatchQuality = (query: string, text: string) => {
	const q = toSearchable(query)
	const t = toSearchable(text)
	if (q.length < DEFAULTS.minMatchCharLength) return 0 // ignore very short queries
	if (t === q) return 1 // exact match -> strongest
	if (t.startsWith(q)) return 0.95 // starts with query -> very strong
	if (t.includes(q)) return 0.85 // contains query -> weaker
	return 0 // no match
}

const highlightSnippet = (text: string, query: string, maxLen = 120) => {
	const trimmed = text.trim()
	const q = toSearchable(query)
	const idx = trimmed.toLowerCase().indexOf(q)

	if (idx === -1) {
		// if no match, just return truncated text
		return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen)}...` : trimmed
	}

	const half = Math.floor(maxLen / 2)
	const start = Math.max(0, idx - half)
	const end = Math.min(trimmed.length, idx + q.length + half)
	const snippet = trimmed.slice(start, end)

	const safe = escapeRegExp(q)
	const marked = snippet.replace(
		new RegExp(`(${safe})`, "gi"),
		`<mark class="bg-[var(--color-highlight-bg)] text-[var(--color-highlight-text)] rounded-sm px-0.5 font-medium">$1</mark>`
	)

	return `${start > 0 ? "..." : ""}${marked}${end < trimmed.length ? "..." : ""}`
}

export function useFuzzySearch(items: SearchRecord[], query: string, options?: FuzzySearchOptions) {
	const threshold = clamp(options?.threshold ?? DEFAULTS.threshold, 0, 1)
	const minLen = Math.max(0, options?.minMatchCharLength ?? DEFAULTS.minMatchCharLength)

	const raw = query?.trim()
	if (!raw || raw.length < minLen) return []

	const results: SearchResult[] = []

	for (const item of items) {
		const paragraphs: ReadonlyArray<string> = item.paragraphs ?? []

		paragraphs.forEach((paragraph, paragraphIndex) => {
			if (!paragraph) return

			const score = scoreMatchQuality(raw, paragraph)

			if (score >= threshold) {
				results.push({
					item,
					score: clamp(score, 0, 1),
					matchedText: paragraph,
					highlightedText: highlightSnippet(paragraph, raw),
					refIndex: paragraphIndex,
				})
			}
		})
	}

	return results.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.refIndex - b.refIndex))
}
