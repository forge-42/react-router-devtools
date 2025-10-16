export const generateClientLoader = () => {
	return [
		"export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {",
		"  return null;",
		"};",
	].join("\n")
}
