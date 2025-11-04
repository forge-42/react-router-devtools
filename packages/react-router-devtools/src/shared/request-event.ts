import type {
	ActionFunctionArgs,
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
	LoaderFunctionArgs,
} from "react-router"

export type AllDataFunctionArgs =
	| LoaderFunctionArgs
	| ActionFunctionArgs
	| ClientLoaderFunctionArgs
	| ClientActionFunctionArgs
export type NetworkRequestType = "action" | "loader" | "client-action" | "client-loader"
type NetworkRequestTypeFull = "action" | "loader" | "client-action" | "client-loader" | "custom-event"

export type RequestEvent = {
	routine?: "request-event"
	type: NetworkRequestTypeFull
	headers: Record<string, string>
	id: string
	routeId: string
	startTime: number
	endTime?: number | undefined
	// biome-ignore lint/suspicious/noExplicitAny: can be anything
	data?: any | undefined
	method: string
	status?: string
	url: string
	aborted?: boolean
}
