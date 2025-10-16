import type { Page } from "content-collections-types"
import slug from "slug"
import { getPageSlug } from "~/utils/get-page-slug"

function cleanParagraph(raw: string) {
	return (
		raw
			// strip inline code, bold, italics
			.replace(/`([^`]+)`/g, "$1")
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			.replace(/\*([^*]+)\*/g, "$1")
			.replace(/_(.+?)_/g, "$1")
			// strip markdown links [text](url)
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
			// strip mdx attributes { ... } inline
			.replace(/\{[^}]*\}/g, "")
			// list bullets / ordered list markers at line start
			.replace(/^\s*[-*+]\s+/gm, "")
			.replace(/^\s*\d+\.\s+/gm, "")
			// collapse whitespace
			.replace(/\n{2,}/g, "\n")
			.replace(/[ \t]+/g, " ")
			.trim()
	)
}

function stripCodeFences(src: string) {
	return src.replace(/```[\s\S]*?```/g, "")
}

function splitIntoParagraphs(src: string) {
	return src
		.split(/\n\s*\n/g)
		.map(cleanParagraph)
		.filter((p) => p.length > 0)
}

const extractHeadingData = (match: RegExpMatchArray) => {
	const [fullMatch, hashes, text] = match
	return {
		level: hashes.length,
		text,
		index: match.index || 0,
		length: fullMatch.length,
	}
}

function extractHeadingSections(rawMdx: string) {
	const src = stripCodeFences(rawMdx)
	const headingRegex = /^(#{1,6})\s+(.+?)\s*$/gm
	const matches = Array.from(src.matchAll(headingRegex), extractHeadingData)

	const usedAnchors = new Set<string>()

	const createUniqueAnchor = (baseAnchor: string) => {
		let unique = baseAnchor
		let n = 2
		while (usedAnchors.has(unique)) {
			unique = `${baseAnchor}-${n++}`
		}
		usedAnchors.add(unique)
		return unique
	}

	const cleanHeadingText = (text: string) =>
		text
			.replace(/`([^`]+)`/g, "$1")
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			.replace(/\*([^*]+)\*/g, "$1")
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
			.replace(/\{[^}]*\}/g, "")
			.trim()

	if (matches.length === 0) {
		const paragraphs = splitIntoParagraphs(src)
		return paragraphs.length ? [{ heading: "_intro", anchor: "_intro", paragraphs }] : []
	}

	const sections = []

	// we are adding intro section if content exists before first heading
	const introBlock = src.slice(0, matches[0].index).trim()
	if (introBlock) {
		const introParas = splitIntoParagraphs(introBlock)
		if (introParas.length) {
			sections.push({ heading: "_intro", anchor: "_intro", paragraphs: introParas })
		}
	}

	matches.forEach((match, i) => {
		const nextMatch = matches[i + 1]
		const block = src.slice(match.index + match.length, nextMatch?.index).trim()

		const rawHeading = cleanHeadingText(match.text)
		const baseAnchor = slug(rawHeading) || "_section"
		const anchor = createUniqueAnchor(baseAnchor)
		const paragraphs = splitIntoParagraphs(block)

		sections.push({
			heading: rawHeading,
			anchor,
			paragraphs,
		})
	})

	return sections
}

export function createSearchIndex(pages: Page[]) {
	return pages
		.filter((page) => page.slug !== "_index")
		.flatMap((page) => {
			const pageSlug = getPageSlug(page)
			const pageUrl = pageSlug.startsWith("/") ? pageSlug : `/${pageSlug}`
			const sections = extractHeadingSections(page.rawMdx)
			return sections.map((section) => {
				const heading = section.heading === "_intro" ? page.title : section.heading

				return {
					id: `${pageUrl}#${section.anchor}`,
					title: page.title,
					subtitle: heading,
					paragraphs: [heading, ...section.paragraphs],
				}
			})
		})
}
