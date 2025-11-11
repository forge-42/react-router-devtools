/**
 * Opens a source file in the editor using TanStack DevTools' open-source endpoint
 * @param source - The file path to open
 */
export const openSource = (source: string, line?: string, column?: string) => {
	const baseUrl = new URL(import.meta.env?.BASE_URL ?? "/", location.origin)
	const url = new URL(
		`__tsd/open-source?source=${encodeURIComponent(`${source}:${line ?? 0}:${column ?? 0}`)}`,
		baseUrl
	)
	fetch(url).catch(() => {})
}
