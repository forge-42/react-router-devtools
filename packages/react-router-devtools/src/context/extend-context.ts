import type {
	ActionFunctionArgs,
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
	LoaderFunctionArgs,
} from "react-router"

import type { AllDataFunctionArgs, NetworkRequestType } from "../shared/request-event"
import { traceEnd, traceEvent, traceStart } from "./tracing"

const extendContextObject = (routeId: string, type: NetworkRequestType, args: AllDataFunctionArgs) => {
	/**
	 * devTools is a set of utilities to be used in your data fetching functions. If you wish to include these
	 * tools in production, you need to install react-router-devtools as a regular dependency and include the
	 * context part in production!
	 */
	return {
		// Current route ID
		routeId,
		/**
		 * Set of utilities to be used in your data fetching functions to trace events
		 * in network tab of react-router-devtools
		 */
		tracing: {
			/**
			 * trace is a function that will trace the event given to it, pipe it to the network tab of react-router-devtools and show you analytics
			 *
			 * Warning: This function will only work in production if you install react-router-devtools as a regular dependency
			 * and include the context part in production!
			 *  @param name - The name of the event
			 * @param event - The event to be traced
			 * @returns The result of the event

			 */
			trace: traceEvent(type, args, routeId),
			/**
	 * start is a function that will start a trace for the name provided to it and return the start time
	 * This is used together with traceEnd to trace the time of the event
	 *
	 * Warning: This function relies on you using the traceEnd with the same name as the start event, otherwise
	 * you will end up having a never ending loading bar in the network tab!
	 *
	 * @param name - The name of the event
	 * @returns The start time of the event

	 */
			start: traceStart(type, args, routeId),
			/**
			 * end is a function that will end a trace for the name provided to it and return the end time
			 *
			 * @param name - The name of the event
			 * @param startTime - The start time of the sendEvent
			 * @param data - The data to be sent with the event
			 * @returns The data provided in the last parameter
			 */
			end: traceEnd(type, args, routeId),
		},
	}
}

export type ExtendedContext = ReturnType<typeof extendContextObject>

const extendContext =
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
		(routeId: string, type: NetworkRequestType, loaderOrAction: <T>(args: any) => T) =>
		async (args: AllDataFunctionArgs) => {
			const devTools = extendContextObject(routeId, type, args)
			const res = await loaderOrAction({
				...args,
				devTools,
			})
			return res
		}

export const withLoaderContextWrapper = (loader: <T>(args: LoaderFunctionArgs) => T, id: string) => {
	return extendContext(id, "loader", loader)
}

export const withActionContextWrapper = (action: <T>(args: ActionFunctionArgs) => T, id: string) => {
	return extendContext(id, "action", action)
}

export const withClientLoaderContextWrapper = (loader: <T>(args: ClientLoaderFunctionArgs) => T, id: string) => {
	return extendContext(id, "client-loader", loader)
}

export const withClientActionContextWrapper = (action: <T>(args: ClientActionFunctionArgs) => T, id: string) => {
	return extendContext(id, "client-action", action)
}
