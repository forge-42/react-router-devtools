import chalk from "chalk"
import type { ActionFunctionArgs, LoaderFunctionArgs, UNSAFE_DataWithResponseInit } from "react-router"
import { bigIntReplacer } from "../shared/bigint-util.js"
import { sendEvent } from "../shared/send-event.js"
import { type DevToolsServerConfig, getConfig } from "./config.js"
import { actionLog, errorLog, infoLog, loaderLog, redirectLog } from "./logger.js"
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

const unAwaited = async (promise: () => any) => {
	promise()
}

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
	response: Response | Request | UNSAFE_DataWithResponseInit<any> | any
) => {
	if (!isDataFunctionResponse(response) && !(response instanceof Response) && !(response instanceof Request)) {
		return null
	}
	const headers = new Headers(!isDataFunctionResponse(response) ? response.headers : response.init?.headers)
	return Object.fromEntries(headers.entries())
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

	// create the event
	const event = {
		type,
		data: {
			id: routeId,
			executionTime: end,
			timestamp: new Date().getTime(),
			responseData: isDataFunctionResponse(response) ? response.data : response,
			requestHeaders,
			responseHeaders,
		},
	}
	if (typeof process === "undefined") {
		return
	}
	const port = process.rdt_port

	if (port) {
		fetch(`http://localhost:${port}/react-router-devtools-request`, {
			method: "POST",
			body: JSON.stringify(event, bigIntReplacer),
		})
			.then(async (res) => {
				if (res.ok) {
					await res.text()
				}
			})
			.catch(() => {})
	}
}

export const isDataFunctionResponse = (res: any): res is UNSAFE_DataWithResponseInit<any> => {
	return res?.type && res.type === "DataWithResponseInit" && res.data && res.init
}

export const analyzeLoaderOrAction =
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
						url: args.request.url,
						method: args.request.method,
						status: res && typeof res === "object" ? (res as any).status : undefined,
					})
				}
			})
			return res
		} catch (err) {
			errorHandler(routeId, err, true)
		}
	}
