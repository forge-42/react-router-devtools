import { href } from "react-router"
import { splitSlug } from "./split-slug"

export function buildDocSlug({
	section,
	subsection,
	filename,
}: {
	section?: string
	subsection?: string
	filename: string
}) {
	const seg = [section, subsection, filename].map((s) => (s ?? "").trim()).filter(Boolean)
	return seg.join("/")
}

export function buildDocPathFromSlug(slug: string) {
	const parts = slug.split("/").filter(Boolean)

	if (parts.length === 1) {
		return `/${parts[0]}`
	}

	const { section, subsection, filename } = splitSlug(slug)
	return `/${[section, subsection, filename].filter(Boolean).join("/")}`
}

function getFilenameFromSlug(slug: string) {
	return slug.split("/").filter(Boolean).at(-1) ?? slug
}

export function buildStandaloneTo(version: string, slug: string) {
	const filename = getFilenameFromSlug(slug)
	return href("/:version/:section?/:subsection?/:filename", { version, filename })
}

export function buildSectionedTo(version: string, slug: string) {
	const { section, subsection, filename } = splitSlug(slug)
	return href("/:version/:section?/:subsection?/:filename", {
		version,
		section,
		subsection,
		filename,
	})
}
