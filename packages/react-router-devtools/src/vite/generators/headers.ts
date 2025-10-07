export const generateHeaders = () => {
	return ["export const headers: HeadersFunction = () => (", "  {", "    // your headers here", "  }", ");"].join("\n")
}
