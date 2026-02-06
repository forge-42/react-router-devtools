import fs from "node:fs"
import type { ClientEventBusConfig, TanStackDevtoolsConfig } from "@tanstack/devtools"
import { devtools } from "@tanstack/devtools-vite"
import type { TanStackDevtoolsViteConfig } from "@tanstack/devtools-vite"
import { type Plugin, type ResolvedConfig, normalizePath } from "vite"
import type { RdtClientConfig } from "../client/context/RDTContext.js"
import type { DevToolsServerConfig } from "../server/config.js"
import { eventClient } from "../shared/event-client.js"
import { createViteIntegratedEventBus } from "./https-event-bus.js"
import { runner } from "./node-server.js"
import { processPlugins } from "./utils.js"
import { addRouteTypes } from "./utils/codegen.js"
import { augmentDataFetchingFunctions } from "./utils/data-functions-augment.js"
import { injectRdtClient } from "./utils/inject-client.js"
import { injectContext } from "./utils/inject-context.js"
import { augmentMiddlewareFunctions } from "./utils/middleware-augment.js"
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

// Module-level routes map storage
const routesMap = new Map<string, Route[]>()
// Cache for appDir
let cachedAppDir: string | null = null

// Helper function to get appDir from react-router.config.ts or fallback to ./app
const getAppDir = async (): Promise<string> => {
	if (cachedAppDir) return cachedAppDir

	try {
		const path = await import("node:path")
		const configPath = path.join(process.cwd(), "react-router.config.ts")
		const config = await runner.executeFile(configPath)
		cachedAppDir = config.appDirectory || "./app"
	} catch (_e) {
		// If config doesn't exist or can't be read, fallback to ./app
		cachedAppDir = "./app"
	}
	// biome-ignore lint/style/noNonNullAssertion: cachedAppDir is always set in the try or catch block
	return cachedAppDir!
}

// Helper function to load and flatten routes
const loadRoutes = async () => {
	// If routes are already loaded, skip
	if (routesMap.has("flat")) {
		return true
	}

	try {
		const path = await import("node:path")
		const appDir = await getAppDir()

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
		return true
	} catch (_e) {
		// If loading fails, routesMap will remain empty
		return false
	}
}

// Flag to ensure we only set up listeners once
let listenersSetUp = false

// Set up event listeners
const setupEventListeners = () => {
	if (listenersSetUp) return
	listenersSetUp = true

	const unsubscribe = eventClient.on("routes-tab-mounted", async () => {
		// Always try to load routes when tab mounts (in case they weren't loaded before)
		await loadRoutes()

		const flatRoutes = routesMap.get("flat") || []
		eventClient.emit("routes-info", flatRoutes)
	})

	// Return unsubscribe function in case we need it
	return unsubscribe
}

type ReactRouterViteConfig = {
	client?: Partial<RdtClientConfig>
	server?: DevToolsServerConfig
	pluginDir?: string
	includeInProd?: {
		client?: boolean
		server?: boolean
		devTools?: boolean
	}
	tanstackConfig?: Omit<Partial<TanStackDevtoolsConfig>, "customTrigger">
	tanstackClientBusConfig?: Partial<ClientEventBusConfig>
	tanstackViteConfig?: TanStackDevtoolsViteConfig
	/** Experimental codegen feature to automatically add type annotations to route exports */
	experimental_codegen?: {
		enabled: boolean
	}
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
		editorName: "Editor",
	}

	const includeClient = args?.includeInProd?.client ?? false
	const includeServer = args?.includeInProd?.server ?? false
	const includeDevtools = args?.includeInProd?.devTools ?? false
	let port = 5173
	let isHttps = false
	let resolvedConfig: ResolvedConfig | null = null
	// Get appDir synchronously from cache (will be populated when first route loads)
	const appDir = cachedAppDir || "./app"
	const appDirName = appDir.replace("./", "")

	// Load routes eagerly so they're available during transformation
	let routesLoaded = false
	const ensureRoutesLoaded = async () => {
		if (!routesLoaded) {
			routesLoaded = await loadRoutes()
		}
	}

	const shouldInject = (mode: string | undefined, include: boolean) => mode === "development" || include
	const isTransformable = (id: string) => {
		const extensions = [".tsx", ".jsx", ".ts", ".js"]
		if (!extensions.some((ext) => id.endsWith(ext))) {
			return
		}
		if (id.includes("node_modules") || id.includes("?")) {
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

	// Merge tanstack config - we'll handle the event bus ourselves when HTTPS is detected
	const tanstackConfig: TanStackDevtoolsViteConfig = {
		...args?.tanstackViteConfig,
	}

	return [
		// Plugin to detect HTTPS and set up the integrated event bus
		{
			name: "react-router-devtools:https-setup",
			enforce: "pre" as const,
			apply(config) {
				return config.mode === "development"
			},
			configResolved(config) {
				resolvedConfig = config
				isHttps = !!config.server.https
				port = config.server.port ?? 5173

				// If HTTPS is enabled, disable the tanstack event bus server
				// We'll use our own integrated one that works with Vite's HTTPS server
				if (isHttps && tanstackConfig.eventBusConfig?.enabled !== false) {
					tanstackConfig.eventBusConfig = {
						...tanstackConfig.eventBusConfig,
						enabled: false,
					}
				}
			},
			configureServer(server) {
				// If HTTPS is enabled, set up our integrated event bus on Vite's server
				if (isHttps) {
					createViteIntegratedEventBus(server)
				}
			},
		},

		// Plugin to transform client code to use correct protocol (wss:// instead of ws://)
		{
			name: "react-router-devtools:https-client-transform",
			enforce: "pre" as const,
			apply(config) {
				return config.mode === "development"
			},
			transform(code, id) {
				// Transform devtools client code from @tanstack or our bundled client
				const isDevtoolsCode =
					id.includes("devtools") && (id.includes("@tanstack") || id.includes("react-router-devtools"))
				if (!isDevtoolsCode) {
					return
				}

				// If HTTPS is enabled, patch the client to use secure protocols and Vite's port
				if (isHttps && resolvedConfig) {
					let transformed = code
					// Replace ws:// with wss://
					transformed = transformed.replace(/ws:\/\/localhost/g, "wss://localhost")
					// Replace http://localhost with https://localhost
					transformed = transformed.replace(/http:\/\/localhost/g, "https://localhost")
					// Replace the devtools port with Vite's port
					transformed = transformed.replace(/__TANSTACK_DEVTOOLS_PORT__/g, String(port))
					// Replace hardcoded default port 4206 with Vite's port
					transformed = transformed.replace(/localhost:4206/g, `localhost:${port}`)
					// Also replace template string port references
					transformed = transformed.replace(/\$\{this\.#port\}/g, String(port))

					if (transformed !== code) {
						return { code: transformed, map: null }
					}
				}
			},
		},

		...devtools(tanstackConfig),

		{
			name: "react-router-devtools",
			apply(config) {
				return shouldInject(config.mode, includeClient)
			},
			async configResolved(resolvedViteConfig) {
				const reactRouterIndex = resolvedViteConfig.plugins.findIndex((p) => p.name === "react-router")
				const devToolsIndex = resolvedViteConfig.plugins.findIndex((p) => p.name === "react-router-devtools")
				if (reactRouterIndex >= 0 && devToolsIndex > reactRouterIndex) {
					throw new Error("react-router-devtools plugin has to be before the react-router plugin!")
				}
			},
			config(config) {
				// When HTTPS is detected, we need to exclude the client from pre-bundling
				// so our transform plugin can patch the WebSocket URLs
				const needsTransform = !!config.server?.https
				config.optimizeDeps = {
					...config.optimizeDeps,
					include: [
						...(config.optimizeDeps?.include ?? []),
						"react-router-devtools > react-d3-tree",
						...(needsTransform
							? []
							: ["react-router-devtools/client", "react-router-devtools/context", "react-router-devtools/server"]),
					],
					exclude: [
						...(config.optimizeDeps?.exclude ?? []),
						...(needsTransform ? ["react-router-devtools/client", "@tanstack/devtools-event-bus"] : []),
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
				// Merge HTTPS-aware client bus config when HTTPS is detected
				const clientBusConfig = {
					...(args?.tanstackClientBusConfig || {}),
					...(isHttps
						? {
								protocol: "wss" as const,
								port: port,
								host: "localhost",
							}
						: {}),
				}
				const config = `{
				"config": ${JSON.stringify(clientConfig)},
				"plugins": "[${pluginNames.join(",")}]",
				"tanstackConfig": ${JSON.stringify(args?.tanstackConfig || {})},
				"tanstackClientBusConfig": ${JSON.stringify(clientBusConfig)}
				}`
				return injectRdtClient(code, config, pluginImports, id)
			},
		},
		{
			name: "react-router-devtools:inject-context",
			apply(config) {
				return shouldInject(config.mode, includeDevtools)
			},
			async transform(code, id) {
				await ensureRoutesLoaded()
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
			async transform(code, id) {
				await ensureRoutesLoaded()
				const routeId = isTransformable(id)
				if (!routeId) {
					return
				}
				const finalCode = augmentDataFetchingFunctions(code, routeId, id)
				return finalCode
			},
		},
		{
			name: "react-router-devtools:middleware-augment",
			apply(config) {
				return shouldInject(config.mode, includeServer)
			},
			async transform(code, id) {
				await ensureRoutesLoaded()
				const routeId = isTransformable(id)
				if (!routeId) {
					return
				}
				const finalCode = augmentMiddlewareFunctions(code, routeId, id)
				return finalCode
			},
		},
		// Codegen plugin - watches for file changes and adds type annotations to route exports
		...(args?.experimental_codegen?.enabled
			? [
					(() => {
						// Set to track recently processed files to avoid infinite loops
						const recentlyProcessed = new Set<string>()
						const DEBOUNCE_MS = 100

						return {
							name: "react-router-devtools:codegen",
							apply(config) {
								return config.mode === "development"
							},
							async watchChange(id, change) {
								// Only process on create or update
								if (change.event !== "create" && change.event !== "update") {
									return
								}

								// Skip if recently processed (debounce)
								if (recentlyProcessed.has(id)) {
									return
								}

								// Ensure routes are loaded
								await ensureRoutesLoaded()

								// Check if it's a route file
								const routeId = isTransformable(id)
								if (!routeId) {
									return
								}

								try {
									// Read the file
									const code = await fs.promises.readFile(id, "utf-8")

									// Transform the code
									const result = addRouteTypes(code, id)

									// Only write if modifications were made
									if (result.modified) {
										// Add to recently processed set
										recentlyProcessed.add(id)

										// Write the file
										await fs.promises.writeFile(id, result.code, "utf-8")

										// Remove from set after debounce period
										setTimeout(() => {
											recentlyProcessed.delete(id)
										}, DEBOUNCE_MS)
									}
								} catch (_e) {
									// Silently ignore errors (invalid syntax, etc.)
								}
							},
						} satisfies Plugin
					})(),
				]
			: []),
		{
			enforce: "pre",
			name: "react-router-devtools:grab-port",
			apply(config) {
				// Custom server is only needed in development for piping events to the client
				return config.mode === "development"
			},
			async configureServer(server) {
				// Set up event listeners when server is configured
				setupEventListeners()

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
			},
		},
	]
}
