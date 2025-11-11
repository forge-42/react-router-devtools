import type { ClientActionFunctionArgs, ClientLoaderFunctionArgs, LinksFunction } from "react-router"
import { convertBigIntToString } from "../shared/bigint-util"
import { eventClient } from "../shared/event-client"
import type { RequestEvent } from "../shared/request-event"

const sendEventToDevServer = (req: RequestEvent) => {
	if (req.data) {
		req.data = convertBigIntToString(req.data)
	}
	eventClient.emit("request-event", req)
}

const analyzeClientLoaderOrAction = (
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the return type
	loaderOrAction: (args: any) => Promise<any>,
	routeId: string,
	type: "client-loader" | "client-action"
) => {
	return async (args: ClientLoaderFunctionArgs | ClientActionFunctionArgs) => {
		const startTime = Date.now()
		const headers = Object.fromEntries(args.request.headers.entries())
		sendEventToDevServer({
			type,
			url: args.request.url,
			headers,
			startTime,
			id: routeId,
			routeId: routeId,
			method: args.request.method,
		})
		let aborted = false
		args.request.signal.addEventListener("abort", () => {
			aborted = true
			sendEventToDevServer({
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

		const data = await loaderOrAction(args)
		if (!aborted) {
			sendEventToDevServer({
				type,
				url: args.request.url,
				headers,
				startTime,
				endTime: Date.now(),
				id: routeId,
				routeId: routeId,
				data,
				method: args.request.method,
			})
		}

		return data
	}
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the return type
export const withClientLoaderWrapper = (clientLoader: (args: ClientLoaderFunctionArgs) => any, routeId: string) => {
	return analyzeClientLoaderOrAction(clientLoader, routeId, "client-loader")
}

export const withLinksWrapper = (links: LinksFunction, rdtStylesheet: string): LinksFunction => {
	return () => [...links(), { rel: "stylesheet", href: rdtStylesheet }]
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the return type
export const withClientActionWrapper = (clientAction: (args: ClientActionFunctionArgs) => any, routeId: string) => {
	return analyzeClientLoaderOrAction(clientAction, routeId, "client-action")
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
const analyzeClientMiddleware = (middleware: any, routeId: string, index: number, middlewareName?: string) => {
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
	return async (args: any, next: any) => {
		const startTime = Date.now()
		const name = middlewareName || middleware.name || `Anonymous ${index}`

		sendEventToDevServer({
			type: "client-middleware",
			url: args.request.url,
			headers: Object.fromEntries(args.request.headers.entries()),
			startTime,
			id: routeId,
			routeId: routeId,
			method: args.request.method,
			middlewareName: name,
			middlewareIndex: index,
		})

		const result = await middleware(args, next)

		sendEventToDevServer({
			type: "client-middleware",
			url: args.request.url,
			headers: Object.fromEntries(args.request.headers.entries()),
			startTime,
			endTime: Date.now(),
			id: routeId,
			routeId: routeId,
			method: args.request.method,
			middlewareName: name,
			middlewareIndex: index,
		})

		return result
	}
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
export const withClientMiddlewareWrapper = (middlewares: any[], routeId: string) => {
	return middlewares.map((middleware, index) => analyzeClientMiddleware(middleware, routeId, index))
}

// Single middleware wrapper for use by AST transformation
export const withClientMiddlewareWrapperSingle = (
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
	middleware: any,
	routeId: string,
	index: number,
	middlewareName: string
) => {
	return analyzeClientMiddleware(middleware, routeId, index, middlewareName)
}
