import { writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { GENERATORS, type Generator } from "./generators"

export type WriteFileData = {
	type: "write-file"
	path: string
	openInEditor: (path: string, lineNum: string | undefined, columnNum: string | undefined) => void
	options: {
		loader: boolean
		clientLoader: boolean
		action: boolean
		clientAction: boolean
		headers: boolean
		errorBoundary: boolean
		revalidate: boolean
		handler: boolean
		meta: boolean
		links: boolean
	}
	appDir: string
}
const defaultGenerationOrder: Exclude<Generator, "dependencies">[] = [
	"links",
	"meta",
	"handler",
	"headers",
	"loader",
	"clientLoader",
	"action",
	"clientAction",
	"component",
	"errorBoundary",
	"revalidate",
]
export const handleWriteFile = async ({ path, options, openInEditor, appDir }: WriteFileData) => {
	const generatorOptions = Object.entries(options)
		.map(([key, value]) => {
			if (value) {
				return { key }
			}
		})
		.filter(Boolean) as unknown as { key: Exclude<Generator, "dependencies"> }[]
	let outputFile = `${resolve(appDir, "routes", path)}`
	const extensions = [".tsx", ".jsx", ".ts", ".js"]
	if (!extensions.some((ext) => outputFile.endsWith(ext))) {
		outputFile = `${outputFile}.tsx`
	}
	const selectedGenerators: Exclude<Generator, "dependencies">[] = [
		"component",
		...generatorOptions.map((option) => option.key),
	]
	const withLoader = selectedGenerators.includes("loader" as any)
	const fileContent = [
		GENERATORS.dependencies(selectedGenerators),
		...defaultGenerationOrder.map((generatorKey) => {
			if (generatorKey === "component") {
				return GENERATORS[generatorKey](withLoader)
			}
			if (selectedGenerators.includes(generatorKey)) {
				return GENERATORS[generatorKey]()
			}
			return undefined
		}),
	]
		.filter(Boolean)
		.join("\n\n")
	await writeFile(outputFile, fileContent)
	openInEditor(outputFile, undefined, undefined)
}
