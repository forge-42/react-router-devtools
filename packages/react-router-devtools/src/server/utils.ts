import chalk from "chalk"
import type { ActionFunctionArgs, LoaderFunctionArgs, UNSAFE_DataWithResponseInit } from "react-router"
import { eventClient } from "../shared/event-client.js"
import { sendEvent } from "../shared/send-event.js"
import { type DevToolsServerConfig, getConfig } from "./config.js"
import { actionLog, errorLog, infoLog, loaderLog, middlewareLog, redirectLog } from "./logger.js"
import { diffInMs, secondsToHuman } from "./perf.js"

export const analyzeCookies = (routeId: string, config: DevToolsServerConfig, headers: Headers) => {
	if (config.logs?.cookies === false) {
		return
	}
	if (headers.get("Set-Cookie")) {
		infoLog(`🍪 Cookie set by ${chalk.blueBright(routeId)}`)
	}
}

export const analyzeCache = (routeId: string, config: DevToolsServerConfig, headers: Headers) => {
	if (config.logs?.cache === false) {
		return
	}
	if (headers.get("Cache-Control")) {
		const cacheDuration = headers
			.get("Cache-Control")
			?.split(" ")
			.map((x) => x.trim().replace(",", ""))

		const age = cacheDuration?.find((x) => x.includes("max-age"))
		const serverAge = cacheDuration?.find((x) => x.includes("s-maxage"))
		const isPrivate = cacheDuration?.find((x) => x.includes("private"))
		if (age && serverAge && !isPrivate) {
			const duration = serverAge.split("=")[1]
			const durationNumber = Number.isNaN(Number.parseInt(duration)) ? 0 : Number.parseInt(duration)
			return infoLog(
				`📦 Route ${chalk.blueBright(routeId)} cached for ${chalk.green(secondsToHuman(durationNumber))} ${chalk.green(
					"[Shared Cache]"
				)}`
			)
		}
		if (age) {
			const duration = age.split("=")[1]
			const durationNumber = Number.isNaN(Number.parseInt(duration)) ? 0 : Number.parseInt(duration)

			infoLog(
				`📦 Route ${chalk.blueBright(routeId)} cached for ${chalk.green(secondsToHuman(durationNumber))} ${chalk.green(
					`[${isPrivate ? "Private Cache" : "Shared Cache"}]`
				)}`
			)
		}
		if (serverAge) {
			const duration = serverAge.split("=")[1]
			const durationNumber = Number.isNaN(Number.parseInt(duration)) ? 0 : Number.parseInt(duration)
			infoLog(
				`📦 Route ${chalk.blueBright(routeId)} cached for ${chalk.green(secondsToHuman(durationNumber))} ${chalk.green(
					"[Shared Cache]"
				)}`
			)
		}
	}
}

export const analyzeClearSite = (routeId: string, config: DevToolsServerConfig, headers: Headers) => {
	if (config.logs?.siteClear === false) {
		return
	}

	if (headers.get("Clear-Site-Data")) {
		const data = headers.get("Clear-Site-Data")
		infoLog(`🧹 Site data cleared by ${chalk.blueBright(routeId)} ${chalk.green(`[${data}]`)}`)
	}
}
export const analyzeServerTimings = (routeId: string, config: DevToolsServerConfig, headers: Headers) => {
	if (config.logs?.serverTimings === false) {
		return
	}
	const data = headers.get("Server-Timing")

	if (data) {
		const splitEntries = data.split(",")
		for (const entry of splitEntries) {
			const segments = entry.split(";")
			let name: string | null = null
			let desc: string | null = null
			let dur: number | null = null

			for (const segment of segments) {
				const [key, value] = segment.split("=")
				if (key === "desc") {
					desc = value
				} else if (key === "dur") {
					dur = Number(value)
				} else {
					name = segment.trim()
				}
			}
			if (!name || dur === null) {
				return
			}
			const threshold = config.serverTimingThreshold ?? Number.POSITIVE_INFINITY
			const overThreshold = dur >= threshold
			const durationColor = overThreshold ? chalk.redBright : chalk.green
			infoLog(
				`⏰  Server timing for route ${chalk.blueBright(routeId)} - ${chalk.cyanBright(name)} ${durationColor(`[${dur}ms]`)} ${desc ? chalk.yellow(`[${desc}]`) : ""}`.trim()
			)
		}
	}
}

const analyzeHeaders = (routeId: string, response: unknown) => {
	const headers = new Headers(
		isDataFunctionResponse(response) && response.init
			? response.init.headers
			: response instanceof Response
				? response.headers
				: {}
	)
	const config = getConfig()
	analyzeCookies(routeId, config, headers)
	analyzeCache(routeId, config, headers)
	analyzeClearSite(routeId, config, headers)
	analyzeServerTimings(routeId, config, headers)
}

// biome-ignore lint/suspicious/noExplicitAny: can be any type
const logDeferredObject = (response: Record<any, any>, id: string, start: number, preKey = "") => {
	let hasPromises = false
	const deferredKeys = []
	for (const [key, value] of Object.entries(isDataFunctionResponse(response) ? response.data : response)) {
		if (value instanceof Promise) {
			deferredKeys.push(preKey ? `${preKey}.${key}` : key)
			hasPromises = true
			value
				.then((val) => {
					const end = diffInMs(start)
					infoLog(
						`Promise ${chalk.white(preKey ? `${preKey}.${key}` : key)} resolved in ${chalk.blueBright(id)} - ${chalk.white(`${end}ms`)}`
					)
					logDeferredObject(val, id, start, preKey ? `${preKey}.${key}` : key)
				})
				// biome-ignore lint/suspicious/noExplicitAny: can also be any type
				.catch((e: any) => {
					errorLog(`Promise ${chalk.white(preKey ? `${preKey}.${key}` : key)} rejected in ${chalk.blueBright(id)}`)
					errorLog(e?.message ? e.message : e)
				})
		}
	}
	if (hasPromises) {
		infoLog(`Promises detected in ${chalk.blueBright(id)} - ${chalk.white(deferredKeys.join(", "))}`)
	}
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
export const analyzeDeferred = (id: string, start: number, response: any) => {
	const config = getConfig()
	if (config.logs?.defer === false || config.silent) {
		return
	}
	if (!response || response instanceof Response || typeof response !== "object") {
		return
	}
	logDeferredObject(response, id, start)
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
const unAwaited = async (promise: () => any) => {
	promise()
}

// biome-ignore lint/suspicious/noExplicitAny: can be any type
export const errorHandler = (routeId: string, e: any, shouldThrow = false) => {
	unAwaited(() => {
		if (isDataFunctionResponse(e)) {
			const headers = new Headers(e.init?.headers)
			const location = headers.get("Location")
			if (location) {
				redirectLog(`${chalk.blueBright(routeId)} threw a response!`)
				redirectLog(`${chalk.blueBright(routeId)} redirected to ${chalk.green(location)}`)
			} else {
				errorLog(`${chalk.blueBright(routeId)} threw a response!`)
				if (e.init?.status) {
					errorLog(`${chalk.blueBright(routeId)} responded with ${chalk.white(e.init.status)}`)
				}
			}
			return
		}
		if (e instanceof Response) {
			const headers = new Headers(e.headers)
			const location = headers.get("Location")
			if (location) {
				redirectLog(`${chalk.blueBright(routeId)} threw a response!`)
				redirectLog(`${chalk.blueBright(routeId)} redirected to ${chalk.green(location)}`)
			} else {
				errorLog(`${chalk.blueBright(routeId)} threw a response!`)
				if (e.status) {
					errorLog(`${chalk.blueBright(routeId)} responded with ${chalk.white(e.status)}`)
				}
			}
		} else {
			errorLog(`${chalk.blueBright(routeId)} threw an error!`)
			errorLog(`${e?.message ?? e}`)
		}
	})
	if (shouldThrow) {
		throw e
	}
}
export const logTrigger = (id: string, type: "action" | "loader", end: number) => {
	if (type === "action") {
		actionLog(`${chalk.blueBright(id)} triggered - ${chalk.white(`${end}ms`)}`)
	} else {
		loaderLog(`${chalk.blueBright(id)} triggered - ${chalk.white(`${end}ms`)}`)
	}
}

export const extractHeadersFromResponseOrRequest = (
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
	response: Response | Request | UNSAFE_DataWithResponseInit<any> | any
) => {
	if (!isDataFunctionResponse(response) && !(response instanceof Response) && !(response instanceof Request)) {
		return null
	}
	const headers = new Headers(!isDataFunctionResponse(response) ? response.headers : response.init?.headers)
	return Object.fromEntries(headers.entries())
}

/**
 * Converts BigInt values to strings in an object/array structure
 * This allows the data to be serialized to JSON without errors
 */
// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
const serializeBigInt = (obj: any): any => {
	if (obj === null || obj === undefined) {
		return obj
	}

	if (typeof obj === "bigint") {
		return obj.toString()
	}

	if (Array.isArray(obj)) {
		return obj.map(serializeBigInt)
	}

	if (typeof obj === "object") {
		const result: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(obj)) {
			result[key] = serializeBigInt(value)
		}
		return result
	}

	return obj
}

const storeAndEmitActionOrLoaderInfo = async (
	type: "action" | "loader",
	routeId: string,
	response: unknown,
	end: number,
	args: LoaderFunctionArgs | ActionFunctionArgs
) => {
	const responseHeaders = extractHeadersFromResponseOrRequest(response)
	const requestHeaders = extractHeadersFromResponseOrRequest(args.request)

	const responseData = isDataFunctionResponse(response) ? response.data : response

	// create the event data matching LoaderEvent["data"] / ActionEvent["data"] type
	const eventData = {
		id: routeId,
		executionTime: end,
		timestamp: new Date().getTime(),
		responseData: serializeBigInt(responseData),
		requestHeaders: requestHeaders || {},
		responseHeaders: responseHeaders || {},
		requestData: undefined, // TODO: Extract request data if needed (e.g., formData for actions)
	}

	// Emit the event via event client
	if (type === "loader") {
		eventClient.emit("loader-event", eventData)
	} else {
		eventClient.emit("action-event", eventData)
	}
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
export const isDataFunctionResponse = (res: any): res is UNSAFE_DataWithResponseInit<any> => {
	return res?.type && res.type === "DataWithResponseInit" && res.data && res.init
}

export const analyzeLoaderOrAction =
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
		(routeId: string, type: "action" | "loader", loaderOrAction: (args: any) => Promise<any>) =>
		async (args: LoaderFunctionArgs | ActionFunctionArgs) => {
			const start = performance.now()
			const response = loaderOrAction(args)
			const headers = Object.fromEntries(args.request.headers.entries())
			const startTime = Date.now()
			sendEvent({
				type,
				headers,
				startTime,
				method: args.request.method,
				url: args.request.url,
				id: routeId,
				routeId: routeId,
			})
			let aborted = false
			args.request.signal.addEventListener("abort", () => {
				aborted = true
				sendEvent({
					type,
					url: args.request.url,
					headers,
					startTime,
					endTime: Date.now(),
					id: routeId,
					routeId: routeId,
					method: args.request.method,
					aborted: true,
				})
			})
			try {
				const res = await response

				unAwaited(() => {
					const end = diffInMs(start)
					const endTime = Date.now()
					storeAndEmitActionOrLoaderInfo(type, routeId, res, end, args)
					logTrigger(routeId, type, end)
					analyzeDeferred(routeId, start, res)
					analyzeHeaders(routeId, res)
					if (!aborted) {
						sendEvent({
							type,
							headers,
							startTime,
							endTime,
							data: res,
							id: routeId,
							routeId: routeId,
							url: args.request.url,
							method: args.request.method,
							// biome-ignore lint/suspicious/noExplicitAny: we don't know the type
							status: res && typeof res === "object" ? (res as any).status : undefined,
						})
					}
				})
				return res
			} catch (err) {
				errorHandler(routeId, err, true)
			}
		}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
export const analyzeMiddleware = (middleware: any, routeId: string, index: number, middlewareName?: string) => {
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
	return async (args: any, next: any) => {
		const start = performance.now()
		const startTime = Date.now()
		const name = middlewareName || middleware.name || `Anonymous ${index}`

		middlewareLog(`${chalk.blueBright(routeId)} - ${chalk.white(name)} triggered`)

		// Send start event
		const headers = Object.fromEntries(args.request.headers.entries())
		sendEvent({
			type: "middleware",
			url: args.request.url,
			headers,
			startTime,
			id: routeId,
			routeId: routeId,
			method: args.request.method,
			middlewareName: name,
			middlewareIndex: index,
		})

		try {
			const result = await middleware(args, next)
			const end = diffInMs(start)

			middlewareLog(`${chalk.blueBright(routeId)} - ${chalk.white(name)} triggered - ${chalk.white(`${end}ms`)}`)

			// Send end event
			sendEvent({
				type: "middleware",
				url: args.request.url,
				headers,
				startTime,
				endTime: Date.now(),
				id: routeId,
				routeId: routeId,
				method: args.request.method,
				middlewareName: name,
				middlewareIndex: index,
			})

			return result
		} catch (err) {
			errorHandler(routeId, err, true)
		}
	}
}
