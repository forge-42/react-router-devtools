export const generateClientAction = () => {
	return [
		"export const clientAction = async ({ request }: ClientActionFunctionArgs) => {",
		"  return null;",
		"};",
	].join("\n")
}
