import type { AllDataFunctionArgs, NetworkRequestType, RequestEvent } from "../shared/request-event"
import { sendEvent } from "../shared/send-event"

export const traceEvent =
	(type: NetworkRequestType, args: AllDataFunctionArgs) =>
	async <T>(name: string, event: (...args: any) => T) => {
		const isServer = type === "action" || type === "loader"
		const emitEventFunction = isServer
			? sendEvent
			: (data: RequestEvent) => import.meta.hot?.send("request-event", data)
		const startTime = Date.now()
		emitEventFunction({
			type: "custom-event",
			startTime,
			url: args.request.url,
			id: `${name}`,
			headers: {},
			method: args.request.method,
		})
		const data = await event()
		emitEventFunction({
			type: "custom-event",
			startTime,
			endTime: Date.now(),
			url: args.request.url,
			id: `${name}`,
			headers: {},
			method: args.request.method,
			data,
		})
		return data
	}

export const traceStart = (type: NetworkRequestType, args: AllDataFunctionArgs) => (name: string) => {
	const isServer = type === "action" || type === "loader"
	const emitEventFunction = isServer ? sendEvent : (data: RequestEvent) => import.meta.hot?.send("request-event", data)
	const startTime = Date.now()
	emitEventFunction({
		type: "custom-event",
		startTime,
		url: args.request.url,
		id: `${name}`,
		headers: {},
		method: args.request.method,
	})
	return startTime
}

export const traceEnd =
	(type: NetworkRequestType, args: AllDataFunctionArgs) =>
	<T>(name: string, startTime: number, data?: T) => {
		const isServer = type === "action" || type === "loader"
		const emitEventFunction = isServer
			? sendEvent
			: (data: RequestEvent) => import.meta.hot?.send("request-event", data)

		emitEventFunction({
			type: "custom-event",
			startTime,
			endTime: Date.now(),
			url: args.request.url,
			id: `${name}`,
			headers: {},
			method: args.request.method,
			data,
		})
		return data
	}
