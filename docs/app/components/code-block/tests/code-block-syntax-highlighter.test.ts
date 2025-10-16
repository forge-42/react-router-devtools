import { getTokenColor, isTokenType, tokenize } from "../code-block-syntax-highlighter"

describe("tokenize test suite", () => {
	it("should tokenize keywords", () => {
		const tokens = tokenize("const let var function return if else")
		expect(tokens.map((t) => t.type)).toContain("keyword")
		expect(tokens.some((t) => t.value === "const")).toBe(true)
	})

	it("should tokenize strings (single and double quotes)", () => {
		const tokens = tokenize(`'hello' "world"`)
		expect(tokens.filter((t) => t.type === "string")).toHaveLength(2)
	})

	it("should tokenize numbers (integers and floats)", () => {
		const tokens = tokenize("42 3.14")
		expect(tokens.filter((t) => t.type === "number")).toHaveLength(2)
	})

	it("should tokenize single-line comments", () => {
		const tokens = tokenize("// comment here")
		expect(tokens[0]).toEqual({ type: "comment", value: "// comment here" })
	})

	it("should tokenize multi-line comments", () => {
		const tokens = tokenize("/* multi\nline\ncomment */")
		expect(tokens[0].type).toBe("comment")
	})

	it("should tokenize operators", () => {
		const tokens = tokenize("a + b - c * d / e == f && g || h")
		expect(tokens.filter((t) => t.type === "operator").length).toBeGreaterThan(0)
	})

	it("should tokenize punctuation", () => {
		const tokens = tokenize("{ } ( ) [ ] ; , .")
		expect(tokens.filter((t) => t.type === "punctuation").length).toBeGreaterThan(0)
	})

	it("should classify whitespace as text", () => {
		const tokens = tokenize("   \n\t")
		expect(tokens.every((t) => t.type === "text")).toBe(true)
	})

	it("should classify lowercase identifiers as text when not keywords", () => {
		const tokens = tokenize("myVariable anotherThing")
		const nonWhitespaceTextTokens = tokens.filter((t) => t.type === "text" && t.value.trim() !== "")
		expect(nonWhitespaceTextTokens.length).toBe(2)
	})
	it("should handle empty input", () => {
		expect(tokenize("")).toEqual([])
	})

	it("should handle mixed code sample", () => {
		const code = `
			// comment
			const x = 42;
			function Test() {
				return "hello";
			}
		`
		const tokens = tokenize(code)
		expect(tokens.some((t) => t.type === "keyword")).toBe(true)
		expect(tokens.some((t) => t.type === "function")).toBe(true)
		expect(tokens.some((t) => t.type === "string")).toBe(true)
		expect(tokens.some((t) => t.type === "comment")).toBe(true)
		expect(tokens.some((t) => t.type === "number")).toBe(true)
	})
})

describe("getTokenColor", () => {
	it("should return a valid CSS variable for each TokenType", () => {
		const tokenTypes = [
			"keyword",
			"string",
			"number",
			"comment",
			"operator",
			"punctuation",
			"function",
			"text",
		] as const

		for (const type of tokenTypes) {
			const color = getTokenColor(type)
			expect(color).toMatch(/^var\(--color-code-/)
		}
	})
})

describe("isTokenType", () => {
	it("should return true for valid token types", () => {
		expect(isTokenType("keyword")).toBe(true)
		expect(isTokenType("string")).toBe(true)
		expect(isTokenType("function")).toBe(true)
	})

	it("should return false for invalid strings", () => {
		expect(isTokenType("not-a-type")).toBe(false)
		expect(isTokenType("")).toBe(false)
		expect(isTokenType("KEYWORD")).toBe(false)
	})

	it("should return false for non-string values", () => {
		expect(isTokenType(undefined)).toBe(false)
		expect(isTokenType(null)).toBe(false)
		expect(isTokenType(42)).toBe(false)
		expect(isTokenType({})).toBe(false)
	})
})
