export const generateAction = () => {
	return ["export const action = async ({ request }: ActionFunctionArgs) => {", "  return null;", "};"].join("\n")
}
