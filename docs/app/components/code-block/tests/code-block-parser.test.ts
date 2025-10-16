import { extractCodeContent, processCopyContent, processLines } from "../code-block-parser"

describe("extractCodeContent test suite", () => {
	it("should return code when children is a string", () => {
		expect(extractCodeContent("console.log('hello')")).toEqual({
			code: "console.log('hello')",
		})
	})

	it("should return code from props.children when children is an object", () => {
		expect(extractCodeContent({ props: { children: "const x = 1" } })).toEqual({
			code: "const x = 1",
		})
	})

	it("should return empty string if children has no props or children", () => {
		// biome-ignore lint/suspicious/noExplicitAny: in tests we may use any type
		expect(extractCodeContent({} as any)).toEqual({ code: "" })
	})
})

describe("processLines test suite", () => {
	it("should split lines by newline", () => {
		expect(processLines("line1\nline2")).toEqual(["line1", "line2"])
	})

	it("should remove trailing empty line", () => {
		expect(processLines("line1\n")).toEqual(["line1"])
	})

	it("should keep empty lines in the middle", () => {
		expect(processLines("a\n\nb")).toEqual(["a", "", "b"])
	})

	it("should return empty array for empty string", () => {
		expect(processLines("")).toEqual([])
	})
})

describe("processCopyContent test suite", () => {
	it("should remove removed lines (starting with '- ')", () => {
		const result = processCopyContent("- removed\nunchanged")
		expect(result.code).toBe("unchanged")
	})

	it("should strip '+ ' from added lines but keep indentation", () => {
		const result = processCopyContent("+ added\n  unchanged")
		expect(result.code).toBe("added\n  unchanged")
	})

	it("should handle mixed added, removed, and unchanged lines", () => {
		const content = `
- removed
+ added
  unchanged
`
		const result = processCopyContent(content)
		expect(result.code).toContain("added")
		expect(result.code).toContain("unchanged")
		expect(result.code).not.toContain("removed")
	})

	it("should return empty string if all lines are removed", () => {
		const result = processCopyContent("- a\n- b")
		expect(result.code).toBe("")
	})
})
