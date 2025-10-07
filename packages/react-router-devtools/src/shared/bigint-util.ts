// biome-ignore lint/suspicious/noExplicitAny: we don't know the data
export const bigIntReplacer = (_key: any, value: any) => (typeof value === "bigint" ? value.toString() : value)

// biome-ignore lint/suspicious/noExplicitAny: we don't know the data
export const convertBigIntToString = (data: any): any => {
	if (typeof data === "bigint") {
		return data.toString()
	}

	if (Array.isArray(data)) {
		return data.map((item) => convertBigIntToString(item))
	}

	if (data !== null && typeof data === "object") {
		return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, convertBigIntToString(value)]))
	}

	return data
}
