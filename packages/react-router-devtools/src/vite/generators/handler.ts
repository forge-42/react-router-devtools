export const generateHandler = () => {
	return ["export const handle = () => ({", "  // your handler here", "});"].join("\n")
}
