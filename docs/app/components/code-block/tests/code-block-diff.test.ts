import { describe, expect, it } from "vitest"
import { cleanDiffLine, getDiffStyles, getDiffType } from "../code-block-diff"

describe("getDiffType test suite", () => {
	it("should return 'added' for lines starting with '+ '", () => {
		expect(getDiffType("+ something")).toBe("added")
	})

	it("should return 'removed' for lines starting with '- '", () => {
		expect(getDiffType("- something")).toBe("removed")
	})

	it("should return 'normal' for lines without a diff prefix", () => {
		expect(getDiffType("  unchanged line")).toBe("normal")
	})

	it("should handle leading whitespace before '+ '", () => {
		expect(getDiffType("    + spaced")).toBe("added")
	})

	it("should handle leading whitespace before '- '", () => {
		expect(getDiffType("    - spaced")).toBe("removed")
	})

	it("should return 'normal' for '+' without space after", () => {
		expect(getDiffType("+no-space")).toBe("normal")
	})

	it("should return 'normal' for '-' without space after", () => {
		expect(getDiffType("-no-space")).toBe("normal")
	})
})

describe("cleanDiffLine test suite", () => {
	it("should remove '+ ' from start while preserving indentation", () => {
		expect(cleanDiffLine("+ added")).toBe("added")
		expect(cleanDiffLine("    + added")).toBe("    added")
	})

	it("should remove '- ' from start while preserving indentation", () => {
		expect(cleanDiffLine("- removed")).toBe("removed")
		expect(cleanDiffLine("  - removed")).toBe("  removed")
	})

	it("should not change lines without diff prefix", () => {
		expect(cleanDiffLine("unchanged")).toBe("unchanged")
		expect(cleanDiffLine("  unchanged")).toBe("  unchanged")
	})
})

describe("getDiffStyles test suite", () => {
	it.each(["added", "removed", "normal"] as const)("should have backgroundColor and indicator for '%s'", (diffType) => {
		const styles = getDiffStyles(diffType)
		expect(styles).toHaveProperty("backgroundColor")
		expect(styles).toHaveProperty("indicator")
	})

	it("should return correct backgroundColor and indicator for 'added'", () => {
		const styles = getDiffStyles("added")
		expect(styles.backgroundColor).toBe("var(--color-diff-added-bg)")
		expect(styles.indicator).toBe("+")
	})

	it("should return correct backgroundColor and indicator for 'removed'", () => {
		const styles = getDiffStyles("removed")
		expect(styles.backgroundColor).toBe("var(--color-diff-removed-bg)")
		expect(styles.indicator).toBe("-")
	})

	it("should return correct backgroundColor and indicator for 'normal'", () => {
		const styles = getDiffStyles("normal")
		expect(styles.backgroundColor).toBe("transparent")
		expect(styles.indicator).toBe("")
	})
})
