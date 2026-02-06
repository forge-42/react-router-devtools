/**
 * This module provides utilities for processing and styling lines of a text diff.
 */
const DIFF_STYLES = {
	added: {
		backgroundColor: "var(--color-diff-added-bg)",
		borderLeft: "2px solid",
		borderLeftColor: "var(--color-diff-added-border)",
		indicator: "+",
	},
	removed: {
		backgroundColor: "var(--color-diff-removed-bg)",
		borderLeft: "2px solid",
		borderLeftColor: "var(--color-diff-removed-border)",
		indicator: "-",
	},
	normal: {
		backgroundColor: "transparent",
		borderLeft: "none",
		borderLeftColor: "transparent",
		indicator: "",
	},
} as const

type DiffType = keyof typeof DIFF_STYLES

const DIFF_PATTERNS = {
	"+ ": "added",
	"- ": "removed",
} as const

type DiffPatternPrefix = keyof typeof DIFF_PATTERNS

const isDiffPatternPrefix = (prefix: string): prefix is DiffPatternPrefix => {
	return prefix in DIFF_PATTERNS
}

export const getDiffType = (line: string): DiffType => {
	const prefix = line.trimStart().slice(0, 2)
	return isDiffPatternPrefix(prefix) ? DIFF_PATTERNS[prefix] : "normal"
}

export const cleanDiffLine = (line: string) => line.replace(/^(\s*)[+-] /, "$1")

export const getDiffStyles = (diffType: DiffType) => DIFF_STYLES[diffType]
