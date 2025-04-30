import { normalizePath } from "vite"
import { checkPath } from "./utils.js"

export type OpenSourceData = {
	type: "open-source"
	data: {
		/** The source file to open */
		source?: string
		/** The react router route ID, usually discovered via the hook useMatches */
		routeID?: string
		/** The line number in the source file */
		line?: number
		/** The column number in the source file */
		column?: number
	}
}

export type EditorConfig = {
	name: string
	open(path: string, lineNumber: string | undefined): void
}

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
	name: "VSCode",
	open: async (path, lineNumber) => {
		const { exec } = await import("node:child_process")
		exec(`code -g "${normalizePath(path).replaceAll("$", "\\$")}${lineNumber ? `:${lineNumber}` : ""}"`)
	},
}

export const handleOpenSource = async ({
	data,
	openInEditor,
	appDir,
}: {
	data: OpenSourceData
	appDir: string
	openInEditor: (path: string, lineNum: string | undefined) => Promise<void>
}) => {
	const { source, line, routeID } = data.data
	const lineNum = line ? `${line}` : undefined
	const fs = await import("node:fs")
	const path = await import("node:path")
	if (source) {
		return openInEditor(source, lineNum)
	}

	if (routeID) {
		const routePath = path.join(appDir, routeID)
		const checkedPath = await checkPath(routePath)

		if (!checkedPath) return
		const { type, validPath } = checkedPath

		const reactExtensions = ["tsx", "jsx"]
		const allExtensions = ["ts", "js", ...reactExtensions]
		const isRoot = routeID === "root"
		const findFileByExtension = (prefix: string, filePaths: string[]) => {
			const file = filePaths.find((file) => allExtensions.some((ext) => file === `${prefix}.${ext}`))
			return file
		}

		if (isRoot) {
			if (!fs.existsSync(appDir)) return
			const filesInReactRouterPath = fs.readdirSync(appDir)
			const rootFile = findFileByExtension("root", filesInReactRouterPath)
			rootFile && openInEditor(path.join(appDir, rootFile), lineNum)
			return
		}

		// If its not the root route, then we find the file or folder in the routes folder
		// We know that the route ID is in the form of "routes/contact" or "routes/user.profile" when is not root
		// so the ID already contains the "routes" segment, so we just need to find the file or folder in the routes folder
		if (type === "directory") {
			const filesInFolderRoute = fs.readdirSync(validPath)
			const routeFile = findFileByExtension("route", filesInFolderRoute)
			routeFile && openInEditor(path.join(appDir, routeID, routeFile), lineNum)
			return
		}
		return openInEditor(validPath, lineNum)
	}
}
