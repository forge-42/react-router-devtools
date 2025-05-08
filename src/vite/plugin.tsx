import chalk from "chalk"
import { type Plugin, normalizePath } from "vite"
import type { RdtClientConfig } from "../client/context/RDTContext.js"
import { cutArrayToLastN } from "../client/utils/common.js"
import type { DevToolsServerConfig } from "../server/config.js"
import type { ActionEvent, LoaderEvent } from "../server/event-queue.js"
import type { RequestEvent } from "../shared/request-event.js"
import { DEFAULT_EDITOR_CONFIG, type EditorConfig, type OpenSourceData, handleOpenSource } from "./editor.js"
import { type WriteFileData, handleWriteFile } from "./file.js"
import { runner } from "./node-server.js"
import { handleDevToolsViteRequest, processPlugins } from "./utils.js"
import { augmentDataFetchingFunctions } from "./utils/data-functions-augment.js"
import { injectRdtClient } from "./utils/inject-client.js"
import { injectContext } from "./utils/inject-context.js"
// this should mirror the types in server/config.ts as well as they are bundled separately.
declare global {
	interface Window {
		RDT_MOUNTED: boolean
	}
	namespace NodeJS {
		interface Process {
			rdt_config: DevToolsServerConfig
			rdt_port: number
		}
	}
}

const routeInfo = new Map<string, { loader: LoaderEvent[]; action: ActionEvent[] }>()
const unusedEvents = new Map<string, RequestEvent>()

type ReactRouterViteConfig = {
	client?: Partial<RdtClientConfig>
	server?: DevToolsServerConfig
	pluginDir?: string
	includeInProd?: {
		client?: boolean
		server?: boolean
		devTools?: boolean
	}
	/** The directory where the react router app is located. Defaults to the "./app" relative to where vite.config is being defined. */
	appDir?: string
	editor?: EditorConfig
}

type Route = {
	id: string
	file: string
	path?: string
	index?: boolean
	caseSensitive?: boolean
	children?: Route[]
}

export const defineRdtConfig = (config: ReactRouterViteConfig) => config

export const reactRouterDevTools: (args?: ReactRouterViteConfig) => Plugin[] = (args) => {
	const serverConfig = args?.server || {}
	const clientConfig = {
		...args?.client,
		editorName: args?.editor?.name,
	}
	const includeClient = args?.includeInProd?.client ?? false
	const includeServer = args?.includeInProd?.server ?? false
	const includeDevtools = args?.includeInProd?.devTools ?? false
	let port = 5173
	let routes: Route[] = []
	let flatRoutes: Route[] = []
	const appDir = args?.appDir || "./app"
	const appDirName = appDir.replace("./", "")
	const shouldInject = (mode: string | undefined, include: boolean) => mode === "development" || include
	const isTransformable = (id: string) => {
		const extensions = [".tsx", ".jsx", ".ts", ".js"]
		if (!extensions.some((ext) => id.endsWith(ext))) {
			return
		}
		if (id.includes("node_modules") || id.includes("dist") || id.includes("build") || id.includes("?")) {
			return
		}

		const isRoute =
			id.includes(`${appDirName}/root`) ||
			flatRoutes.some((route) => id.endsWith(route.file.replace(/^\.\//, "").replace(/^\.\.\//, "")))

		if (!isRoute) {
			return
		}

		const routeId = id
			.replace(normalizePath(process.cwd()), "")
			.replace(`/${appDirName}/`, "")
			.replace(".tsx", "")
			.replace(".ts", "")
		return routeId
	}
	// Set the server config on the process object so that it can be accessed by the plugin
	if (typeof process !== "undefined") {
		process.rdt_config = serverConfig
	}
	return [
		{
			name: "react-router-devtools",
			apply(config) {
				return shouldInject(config.mode, includeClient)
			},
			async configResolved(resolvedViteConfig) {
				try {
					const path = await import("node:path")
					// Set the route config
					const routeConfigExport = (await runner.executeFile(path.join(process.cwd(), "./app/routes.ts"))).default
					const routeConfig = await routeConfigExport
					routes = routeConfig

					const recursiveFlatten = (routeOrRoutes: Route | Route[]): Route[] => {
						if (Array.isArray(routeOrRoutes)) {
							return routeOrRoutes.flatMap((route) => recursiveFlatten(route))
						}
						if (routeOrRoutes.children) {
							return [
								routeOrRoutes,
								...recursiveFlatten(
									routeOrRoutes.children.map((child) => {
										// ./path.tsx => path
										// ../path.tsx => path
										const withoutExtension = child.file
											.split(".")
											.slice(0, -1)
											.join(".")
											.replace(/^\.\//, "")
											.replace(/^\.\.\//, "")
										// ./path.tsx => path
										// ../path.tsx => path
										const withoutExtensionParent = routeOrRoutes.file
											.split(".")
											.slice(0, -1)
											.join(".")
											.replace(/^\.\//, "")
											.replace(/^\.\.\//, "")

										return {
											...child,
											id: child.id ?? withoutExtension,
											parentId: withoutExtensionParent,
										}
									})
								),
							]
						}
						return [routeOrRoutes]
					}
					flatRoutes = routes
						.map((route) => {
							// ./path.tsx => path
							// ../path.tsx => path
							const withoutExtension = route.file
								.split(".")
								.slice(0, -1)
								.join(".")
								.replace(/^\.\//, "")
								.replace(/^\.\.\//, "")
							return { ...route, parentId: "root", id: route.id ?? withoutExtension }
						})
						.flatMap(recursiveFlatten)
				} catch (e) {}
				const reactRouterIndex = resolvedViteConfig.plugins.findIndex((p) => p.name === "react-router")
				const devToolsIndex = resolvedViteConfig.plugins.findIndex((p) => p.name === "react-router-devtools")
				if (reactRouterIndex >= 0 && devToolsIndex > reactRouterIndex) {
					throw new Error("react-router-devtools plugin has to be before the react-router plugin!")
				}
			},
			config(config) {
				config.optimizeDeps = {
					...config.optimizeDeps,
					include: [
						...(config.optimizeDeps?.include ?? []),
						"react-router-devtools > beautify",
						"react-router-devtools > react-diff-viewer-continued",
						"react-router-devtools > react-d3-tree",
						"react-router-devtools > classnames",
						"react-router-devtools > @bkrem/react-transition-group",
						"react-router-devtools/client",
						"react-router-devtools/context",
						"react-router-devtools/server",
					],
				}
			},
			async transform(code, id) {
				const isRoot = id.endsWith("/root.tsx") || id.endsWith("/root.jsx")
				if (!isRoot) {
					return
				}
				const pluginDir = args?.pluginDir || undefined
				const plugins = pluginDir && process.env.NODE_ENV === "development" ? await processPlugins(pluginDir) : []
				const pluginNames = plugins.map((p) => p.name)
				const pluginImports = plugins.map((plugin) => `import { ${plugin.name} } from "${plugin.path}";`).join("\n")
				const config = `{ "config": ${JSON.stringify(clientConfig)}, "plugins": "[${pluginNames.join(",")}]" }`
				return injectRdtClient(code, config, pluginImports, id)
			},
		},
		{
			name: "react-router-devtools:inject-context",
			apply(config) {
				return shouldInject(config.mode, includeDevtools)
			},
			transform(code, id) {
				const routeId = isTransformable(id)
				if (!routeId) {
					return
				}
				const finalCode = injectContext(code, routeId, id)
				return finalCode
			},
		},
		{
			name: "react-router-devtools:data-function-augment",
			apply(config) {
				return shouldInject(config.mode, includeServer)
			},
			transform(code, id) {
				const routeId = isTransformable(id)
				if (!routeId) {
					return
				}
				const finalCode = augmentDataFetchingFunctions(code, routeId, id)
				return finalCode
			},
		},
		{
			enforce: "pre",
			name: "react-router-devtools:custom-server",
			apply(config) {
				// Custom server is only needed in development for piping events to the client
				return config.mode === "development"
			},
			async configureServer(server) {
				if (server.config.appType !== "custom") {
					return
				}
				server.middlewares.use((req, res, next) => {
					if (req.socket.localPort && req.socket.localPort !== port) {
						port = req.socket.localPort
						process.rdt_port = port
					}
					next()
				})
				if (server.config.server.port) {
					process.rdt_port = server.config.server.port ?? 5173
					port = process.rdt_port
				}

				server.httpServer?.on("listening", () => {
					process.rdt_port = server.config.server.port ?? 5173
					port = process.rdt_port
				})
				//@ts-ignore - vite 5/6 compat
				const channel = server.hot.channels.find((channel) => channel.name === "ws") ?? server.environments?.client.hot
				const editor = args?.editor ?? DEFAULT_EDITOR_CONFIG
				const openInEditor = async (path: string | undefined, lineNum: string | undefined) => {
					if (!path) {
						return
					}
					editor.open(path, lineNum)
				}
				server.middlewares.use((req, res, next) =>
					handleDevToolsViteRequest(req, res, next, (parsedData) => {
						const { type, data, routine } = parsedData
						if (routine === "open-source") {
							return handleOpenSource({ data: { type: data.type, data }, openInEditor, appDir })
						}
						if (routine === "request-event") {
							unusedEvents.set(parsedData.id + parsedData.startTime, parsedData)
							for (const client of server.hot.channels) {
								client.send("request-event", JSON.stringify(parsedData))
							}

							return
						}
						const id = data.id
						const existingData = routeInfo.get(id)
						if (existingData) {
							if (type === "loader") {
								existingData.loader = cutArrayToLastN([...existingData.loader, data], 30)
							}
							if (type === "action") {
								existingData.action = cutArrayToLastN([...existingData.action, data], 30)
							}
						} else {
							if (type === "loader") {
								routeInfo.set(id, { loader: [data], action: [] })
							}
							if (type === "action") {
								routeInfo.set(id, { loader: [], action: [data] })
							}
						}
						for (const client of server.hot.channels) {
							client.send("route-info", JSON.stringify({ type, data }))
						}
					})
				)

				server.hot.on("all-route-info", (data, client) => {
					client.send(
						"all-route-info",
						JSON.stringify({
							type: "all-route-info",
							data: Object.fromEntries(routeInfo.entries()),
						})
					)
				})
				server.hot.on("routes-info", (data, client) => {
					client.send(
						"routes-info",
						JSON.stringify({
							type: "routes-info",
							data: flatRoutes,
						})
					)
				})

				if (!server.config.isProduction) {
					channel?.on("remove-event", (data) => {
						const parsedData = data
						const { id, startTime } = parsedData

						unusedEvents.delete(id + startTime)
					})
					channel?.on("get-events", (_, client) => {
						const events = Array.from(unusedEvents.values())

						if (events) {
							client.send("get-events", JSON.stringify(events))
						}
					})
					channel?.on("request-event", (data, client) => {
						unusedEvents.set(data.id + data.startTime, data)
						client.send(
							"request-event",
							JSON.stringify({
								type: "request-event",
								data: data,
								...data,
							})
						)
					})

					server.hot.on("open-source", (data: OpenSourceData) => handleOpenSource({ data, openInEditor, appDir }))
					server.hot.on("add-route", (data: WriteFileData) => handleWriteFile({ ...data, openInEditor }))
				}
			},
		},
		{
			name: "better-console-logs",
			enforce: "pre",
			apply(config) {
				return config.mode === "development"
			},
			async transform(code, id) {
				// Ignore anything external
				if (
					id.includes("node_modules") ||
					id.includes("?raw") ||
					id.includes("dist") ||
					id.includes("build") ||
					!id.includes(appDirName)
				)
					return

				if (code.includes("console.")) {
					const lines = code.split("\n")
					return lines
						.map((line, lineNumber) => {
							if (line.trim().startsWith("//") || line.trim().startsWith("/**") || line.trim().startsWith("*")) {
								return line
							}
							// Do not add for arrow functions or return statements
							if (line.replaceAll(" ", "").includes("=>console.") || line.includes("return console.")) {
								return line
							}

							const column = line.indexOf("console.")
							const location = `${id.replace(normalizePath(process.cwd()), "")}:${lineNumber + 1}:${column + 1}`
							const logMessage = `'${chalk.magenta("LOG")} ${chalk.blueBright(`${location} - http://localhost:${port}/open-source?source=${encodeURIComponent(id.replace(normalizePath(process.cwd()), ""))}&line=${lineNumber + 1}&column=${column + 1}`)}\\n → '`
							if (line.includes("console.log(")) {
								const newLine = `console.log(${logMessage},`
								return line.replace("console.log(", newLine)
							}
							if (line.includes("console.error(")) {
								const newLine = `console.error(${logMessage},`
								return line.replace("console.error(", newLine)
							}
							return line
						})
						.join("\n")
				}
			},
		},
	]
}
