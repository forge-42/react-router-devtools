import { devtools } from "@tanstack/devtools-vite"
import { type Plugin, normalizePath } from "vite"
import type { RdtClientConfig } from "../client/context/RDTContext.js"
import type { DevToolsServerConfig } from "../server/config.js"
import type { ActionEvent, LoaderEvent } from "../server/event-queue.js"
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
	enhancedLogs?: boolean
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
	const routesMap = new Map<string, Route[]>()
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
			routesMap.get("flat")?.some((route) => id.endsWith(route.file.replace(/^\.\//, "").replace(/^\.\.\//, "")))

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
		...devtools({
			eventBusConfig: {
				debug: true,
			},
		}),

		{
			name: "react-router-devtools",
			apply(config) {
				return shouldInject(config.mode, includeClient)
			},
			async configResolved(resolvedViteConfig) {
				try {
					const path = await import("node:path")
					// Set the route config
					const routeConfigExport = (await runner.executeFile(path.join(process.cwd(), appDir, "routes.ts"))).default
					const routeConfig = await routeConfigExport
					routesMap.set("routes", routeConfig)

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
					routesMap.set(
						"flat",
						// biome-ignore lint/style/noNonNullAssertion: set right above
						routesMap
							.get("routes")!
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
					)
				} catch (_e) {}
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
				server.middlewares.use((req, _res, next) => {
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
				const editor = args?.editor ?? DEFAULT_EDITOR_CONFIG
				const openInEditor = async (
					path: string | undefined,
					lineNum: string | undefined,
					columnNum: string | undefined
				) => {
					if (!path) {
						return
					}
					editor.open(path, lineNum, columnNum)
				}

				// Handle open-source requests via middleware (still needed for URL handling)
				server.middlewares.use((req, res, next) =>
					handleDevToolsViteRequest(req, res, next, (parsedData) => {
						const { routine } = parsedData
						if (routine === "open-source") {
							handleOpenSource({ data: { type: parsedData.type, data: parsedData.data }, openInEditor, appDir })
						}
						// Note: response is already ended in handleDevToolsViteRequest
					})
				)

				server.hot.on("all-route-info", (_data, client) => {
					client.send(
						"all-route-info",
						JSON.stringify({
							type: "all-route-info",
							data: Object.fromEntries(routeInfo.entries()),
						})
					)
				})
				server.hot.on("routes-info", (_data, client) => {
					client.send(
						"routes-info",
						JSON.stringify({
							type: "routes-info",
							data: routesMap.get("flat"),
						})
					)
				})

				if (!server.config.isProduction) {
					server.hot.on("open-source", (data: OpenSourceData) =>
						handleOpenSource({
							data: {
								...data,
								data: {
									...data.data,
									source: data.data.source ? normalizePath(`${process.cwd()}/${data.data.source}`) : undefined,
								},
							},
							openInEditor,
							appDir,
						})
					)
					server.hot.on("add-route", (data: WriteFileData) => handleWriteFile({ ...data, openInEditor, appDir }))
				}
			},
		},
	]
}
