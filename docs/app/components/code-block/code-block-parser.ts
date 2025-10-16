import { cleanDiffLine, getDiffStyles, getDiffType } from "./code-block-diff"
import { tokenize } from "./code-block-syntax-highlighter"

interface CodeBlockChild {
	props?: {
		children?: string
	}
}

export const extractCodeContent = (children: string | CodeBlockChild) => {
	const code = typeof children === "string" ? children : (children?.props?.children ?? "")
	return { code }
}

export const processLines = (content: string) => {
	const lines = content.split("\n")
	return filterEmptyLines(lines)
}

const filterEmptyLines = (lines: string[]) => {
	return lines.filter((line, index, array) => {
		const isLastLine = index === array.length - 1
		const isEmpty = line.trim() === ""
		return !(isEmpty && isLastLine)
	})
}

export const createLineData = (line: string) => {
	const diffType = getDiffType(line)
	const cleanLine = cleanDiffLine(line)
	const tokens = tokenize(cleanLine)
	const styles = getDiffStyles(diffType)
	const isNormalDiff = diffType === "normal"

	return {
		diffType,
		cleanLine,
		tokens,
		styles,
		isNormalDiff,
	}
}

export const processCopyContent = (content: string): { code: string } => {
	// removes diff markers from content
	const code = content
		.split("\n")
		.filter((line) => !line.trimStart().startsWith("- "))
		.map((line) => line.replace(/^(\s*)\+ /, "$1"))
		.join("\n")

	return { code }
}
