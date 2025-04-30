export const generateRevalidate = () => {
	return ["export const shouldRevalidate: ShouldRevalidateFunction = () => {", " return true;", "};"].join("\n")
}
