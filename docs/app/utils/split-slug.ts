export function splitSlug(slug: string) {
	const parts = slug.split("/").filter(Boolean)
	if (parts.length === 2) {
		const [section, filename] = parts
		return { section, filename }
	}

	if (parts.length === 3) {
		const [section, subsection, filename] = parts
		return { section, subsection, filename }
	}

	throw new Error(
		`Invalid slug format: expected "section/page" or "section/subsection/page" but got ${parts.length} segments — slug: ${slug}`
	)
}
