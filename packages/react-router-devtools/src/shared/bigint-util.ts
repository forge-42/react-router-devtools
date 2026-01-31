// biome-ignore lint/suspicious/noExplicitAny: we don't know the data
export const bigIntReplacer = (_key: any, value: any) => (typeof value === "bigint" ? value.toString() : value)

const DEFAULT_MAX_DEPTH = 50
const CIRCULAR_PLACEHOLDER = "[Circular]"
const MAX_DEPTH_PLACEHOLDER = "[Max depth reached]"

// biome-ignore lint/suspicious/noExplicitAny: we don't know the data
function convertBigIntToStringInner(data: any, depth: number, seen: WeakSet<object>, maxDepth: number): any {
	if (typeof data === "bigint") {
		return data.toString()
	}

	if (Array.isArray(data)) {
		if (seen.has(data)) return CIRCULAR_PLACEHOLDER
		if (depth >= maxDepth) return MAX_DEPTH_PLACEHOLDER
		seen.add(data)
		const result = data.map((item) => convertBigIntToStringInner(item, depth + 1, seen, maxDepth))
		seen.delete(data)
		return result
	}

	if (data !== null && typeof data === "object") {
		if (seen.has(data)) return CIRCULAR_PLACEHOLDER
		if (depth >= maxDepth) return MAX_DEPTH_PLACEHOLDER
		seen.add(data)
		const result = Object.fromEntries(
			Object.entries(data).map(([key, value]) => [key, convertBigIntToStringInner(value, depth + 1, seen, maxDepth)]),
		)
		seen.delete(data)
		return result
	}

	return data
}

// biome-ignore lint/suspicious/noExplicitAny: we don't know the data
export const convertBigIntToString = (data: any, options?: { maxDepth?: number }): any => {
	const maxDepth = options?.maxDepth ?? DEFAULT_MAX_DEPTH
	return convertBigIntToStringInner(data, 0, new WeakSet(), maxDepth)
}
