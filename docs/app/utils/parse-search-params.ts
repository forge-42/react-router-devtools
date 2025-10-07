import type z from "zod"

export function parseSearchParams<T extends z.ZodTypeAny>(request: Request, schema: T) {
	const url = new URL(request.url)
	const params = Object.fromEntries(url.searchParams.entries())
	const result = schema.safeParse(params)

	if (!result.success) {
		// biome-ignore lint/suspicious/noConsole: keep for debugging
		console.error("Invalid query parameters:", result.error)
		return { params: null }
	}

	return { params: result.data }
}
