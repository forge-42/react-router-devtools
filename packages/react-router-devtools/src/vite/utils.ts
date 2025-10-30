import type { IncomingMessage, ServerResponse } from "node:http"
import { type Connect, normalizePath } from "vite"

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

export const handleDevToolsViteRequest = (
	req: Connect.IncomingMessage,
	res: ServerResponse<IncomingMessage>,
	next: Connect.NextFunction,
	// biome-ignore lint/suspicious/noExplicitAny: can be any type
	cb: (data: any) => void
) => {
	if (req.url?.includes("_rrdt/open-source")) {
		const searchParams = new URLSearchParams(req.url.split("?")[1])
		const source = searchParams.get("source")
		const line = searchParams.get("line")
		const column = searchParams.get("column")
		cb({
			type: "open-source",
			routine: "open-source",
			data: {
				source: source ? normalizePath(`${process.cwd()}/${source}`) : undefined,
				line,
				column,
			},
		})
		res.setHeader("Content-Type", "text/html")
		res.write(`<script>
    window.close();
</script>`)
		res.end()
		return
	}
	if (!req.url?.includes("__rrdt")) {
		return next()
	}

	// biome-ignore lint/suspicious/noExplicitAny: can be any type
	const chunks: any[] = []
	req.on("data", (chunk) => {
		chunks.push(chunk)
	})
	req.on("end", () => {
		const dataToParse = Buffer.concat(chunks)
		try {
			const parsedData = JSON.parse(dataToParse.toString())
			cb(parsedData)
		} catch (_e) {
			// eslint-disable-next-line no-empty
		}
		res.write("OK")
		res.end()
	})
}

export async function checkPath(routePath: string, extensions = [".tsx", ".jsx", ".ts", ".js"]) {
	const fs = await import("node:fs")
	// Check if the path exists as a directory
	if (fs.existsSync(routePath) && fs.lstatSync(routePath).isDirectory()) {
		return { validPath: routePath, type: "directory" } as const
	}

	// Check if the path exists as a file with one of the given extensions
	for (const ext of extensions) {
		const filePath = `${routePath}${ext}`
		if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
			return { validPath: filePath, type: "file" } as const
		}
	}

	// If neither a file nor a directory is found
	return null
}
