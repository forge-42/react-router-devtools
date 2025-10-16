export const generateLoader = () => {
	return ["export const loader = async ({ request }: LoaderFunctionArgs) => {", "  return null;", "};"].join("\n")
}
