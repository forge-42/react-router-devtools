/**
 * Tokenization utility for syntax highlighting code snippets.
 * This utils will produce syntax-highlighted JSX output using theme colors.
 */

type TokenType = "keyword" | "string" | "number" | "comment" | "operator" | "punctuation" | "function" | "text"

const MASTER_REGEX = new RegExp(
  [
    // whitespace
    "\\s+",
    // single-line comment
    "\\/\\/[^\\n\\r]*",
    // multi-line comment
    "\\/\\*[\\s\\S]*?\\*\\/",
    // hash comment at start of line
    "^\\s*#.*$",
    // backtick inline code
    "\\`(?:[^`\\\\]|\\\\.)*\\`",
    // strings
    "(['\"])(?:(?!\\1)[^\\\\]|\\\\.)*\\1",
    // numbers
    "\\d+\\.?\\d*",
    // identifiers
    "[a-zA-Z_$][a-zA-Z0-9_$]*",
    // arrow function
    "=>",
    // operators & punctuation
    "===|!==|<=|>=|==|!=|&&|\\|\\||\\+\\+|--|[+\\-*%=<>!?:(){}\\[\\];,.]|\\/(?![/*])|[+\\-*/%]=",
  ].join("|"),
  "gm"
)



const KEYWORDS = [
	"import",
	"export",
	"default",
	"from",
	"const",
	"let",
	"var",
	"function",
	"return",
	"if",
	"else",
	"for",
	"while",
	"do",
	"switch",
	"case",
	"break",
	"continue",
	"try",
	"catch",
	"finally",
	"throw",
	"new",
	"class",
	"extends",
	"interface",
	"type",
	"public",
	"private",
	"protected",
	"static",
	"async",
	"await",
	"true",
	"false",
	"null",
	"undefined",
	"typeof",
	"instanceof",
]

const OPERATORS = [
	"+",
	"-",
	"*",
	"/",
	"=",
	"==",
	"===",
	"!=",
	"!==",
	"<",
	">",
	"<=",
	">=",
	"&&",
	"||",
	"!",
	"?",
	":",
	"++",
	"--",
	"+=",
	"-=",
	"*=",
	"/=",
	"=>",
]

const isKeyword = (value: string) => KEYWORDS.includes(value)
const isOperator = (value: string) => OPERATORS.includes(value)
const isFunction = (value: string) => /^[A-Z]/.test(value)
const isWhitespace = (value: string) => /^\s/.test(value)
const isComment = (v: string) => v.startsWith("//") || v.startsWith("/*") || /^\s*#/.test(v)
const isString = (value: string) => /^['"`]/.test(value)
const isNumber = (value: string) => /^\d/.test(value)
const isIdentifier = (value: string) => /^[a-zA-Z_$]/.test(value)

const classifyIdentifier = (value: string) => {
	return isKeyword(value) ? "keyword" : isFunction(value) ? "function" : "text"
}

const classifyToken = (value: string) => {
	switch (true) {
		case isWhitespace(value):
			return "text"
		case isComment(value):
			return "comment"
		case isString(value):
			return "string"
		case isNumber(value):
			return "number"
		case isIdentifier(value):
			return classifyIdentifier(value)
		case isOperator(value):
			return "operator"
		default:
			return "punctuation"
	}
}

export const tokenize = (code: string) =>
	Array.from(code.matchAll(MASTER_REGEX), (match) => ({
		type: classifyToken(match[0]),
		value: match[0],
	}))

const TOKEN_COLORS = {
	keyword: "var(--color-code-keyword)",
	string: "var(--color-code-string)",
	number: "var(--color-code-number)",
	comment: "var(--color-code-comment)",
	operator: "var(--color-code-operator)",
	punctuation: "var(--color-code-punctuation)",
	function: "var(--color-code-function)",
	text: "var(--color-code-block-text)",
} as const

export const getTokenColor = (type: TokenType) => TOKEN_COLORS[type]

export function isTokenType(value: unknown): value is TokenType {
	return typeof value === "string" && value in TOKEN_COLORS
}
