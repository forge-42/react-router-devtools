import { uppercaseFirstLetter } from "../client/utils/sanitize.js"

export interface CacheControl {
	maxAge?: string
	maxStale?: string
	minFresh?: string
	sMaxage?: string
	noCache?: boolean
	noStore?: boolean
	noTransform?: boolean
	onlyIfCached?: boolean
	public?: boolean
	private?: boolean
	mustRevalidate?: boolean
	proxyRevalidate?: boolean
	mustUnderstand?: boolean
	immutable?: boolean
	staleWhileRevalidate?: string
	staleIfError?: string
}

export const parseCacheControlHeader = (headers: Headers) => {
	const cacheControl = headers.get("cache-control")
	if (!cacheControl) return {}
	const parts = cacheControl.split(",")
	const cacheControlObject: Record<string, undefined | string> = {}
	for (const part of parts) {
		const [key, value] = part.split("=")
		if (!key) continue
		cacheControlObject[key.trim()] = value?.trim()
	}

	const returnValue = Object.entries(cacheControlObject).reduce((acc, [key, value]) => {
		const k = key
			.trim()
			.split("-")
			.map((k, i) => (i === 0 ? k : uppercaseFirstLetter(k)))
			.join("")
		if (!value) {
			// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
			return { ...acc, [k]: true }
		}
		// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
		return { ...acc, [k]: value }
	}, {} as CacheControl)

	return returnValue
}
