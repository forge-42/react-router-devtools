export const generateMeta = () => {
	return ["export const meta: MetaFunction = () => [", "  // your meta here", "];"].join("\n")
}
