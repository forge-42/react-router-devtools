export async function processPlugins(pluginDirectoryPath: string) {
	const fs = await import("node:fs")
	const { join } = await import("node:path")
	const files = fs.readdirSync(pluginDirectoryPath)

	const allExports: { name: string; path: string }[] = []
	for (const file of files) {
		const filePath = join(pluginDirectoryPath, file)
		const fileCode = fs.readFileSync(filePath, "utf8")
		const lines = fileCode.split("\n")
		for (const line of lines) {
			if (line.includes("export const")) {
				const [name] = line.split("export const ")[1].split(" =")
				allExports.push({ name, path: join("..", filePath).replaceAll("\\", "/") })
			}
		}
	}

	return allExports
}
