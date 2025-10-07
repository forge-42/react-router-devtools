import slugify from "slug"

export type HeadingItem = {
	slug: string
	title: string
	level: number
	children: HeadingItem[]
}

const ATX_RE = /^\s*(#{1,6})\s+(.+?)\s*$/
const FENCE_RE = /^\s*(`{3,}|~{3,})(.*)$/
const SETEXT_UNDERLINE_RE = /^\s*(=+|-+)\s*$/
const FRONTMATTER_DELIM_RE = /^\s*---\s*$/

const cleanMarkdown = (text: string) =>
	text
		.replace(/`([^`]+)`/g, "$1") // inline code
		.replace(/\*\*([^*]+)\*\*/g, "$1") // bold
		.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1$2") // italics
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links -> text
		.replace(/\{[^}]*\}/g, "") // MDX/remark directives
		.replace(/<\/?[^>]+(>|$)/g, "") // HTML tags
		.trim()

function skipFrontmatter(lines: string[], start = 0) {
	if (!lines[start]?.match(FRONTMATTER_DELIM_RE)) return start
	let i = start + 1
	while (i < lines.length && !lines[i].match(FRONTMATTER_DELIM_RE)) i++
	return i < lines.length ? i + 1 : start
}

type FenceState = { inFence: boolean; marker: "`" | "~" | "" }

function fenceStep(state: FenceState, line: string): FenceState {
	const m = line.match(FENCE_RE)
	if (!m) return state
	const marker = (m[1][0] === "`" ? "`" : "~") as "`" | "~"
	if (!state.inFence) return { inFence: true, marker }
	return marker === state.marker ? { inFence: false, marker: "" } : state
}

function parseAtx(line: string): { level: number; text: string } | null {
	const m = line.match(ATX_RE)
	if (!m) return null
	return { level: m[1].length, text: m[2] }
}

function parseSetext(curr: string, next: string): { level: number; text: string } | null {
	if (!/\S/.test(curr)) return null
	if (!SETEXT_UNDERLINE_RE.test(next)) return null
	const level = next.trim().startsWith("=") ? 1 : 2
	return { level, text: curr }
}

function makeNode(level: number, rawTitle: string): HeadingItem | null {
	const title = cleanMarkdown(rawTitle)
	if (!title) return null
	return {
		title,
		slug: slugify(title, { lower: true }),
		level,
		children: [],
	}
}

function pushNode(root: HeadingItem[], stack: HeadingItem[], node: HeadingItem) {
	while (stack.length && stack[stack.length - 1].level >= node.level) {
		stack.pop()
	}
	if (stack.length === 0) root.push(node)
	else stack[stack.length - 1].children.push(node)
	stack.push(node)
}

export function extractHeadingTreeFromMarkdown(content: string, maxDepth = 3) {
	const lines = content.split("\n")
	const root: HeadingItem[] = []
	const stack: HeadingItem[] = []
	let i = skipFrontmatter(lines)
	let fence: FenceState = { inFence: false, marker: "" }

	while (i < lines.length) {
		const line = lines[i]

		// fence handling
		const nextFence = fenceStep(fence, line)
		const justEnteredFence = !fence.inFence && nextFence.inFence
		const justExitedFence = fence.inFence && !nextFence.inFence
		fence = nextFence
		if (justEnteredFence || fence.inFence) {
			i++
			continue
		}
		if (justExitedFence) {
			i++
			continue
		}

		// ATX: "# ...", "## ...", ...
		const atx = parseAtx(line)
		if (atx) {
			if (atx.level <= maxDepth) {
				const node = makeNode(atx.level, atx.text)
				if (node) pushNode(root, stack, node)
			}
			i++
			continue
		}

		// Setext: "Title" + ("===" | "---")
		if (i + 1 < lines.length) {
			const setext = parseSetext(line, lines[i + 1])
			if (setext) {
				if (setext.level <= maxDepth) {
					const node = makeNode(setext.level, setext.text)
					if (node) pushNode(root, stack, node)
				}
				i += 2
				continue
			}
		}

		i++
	}

	return root
}
