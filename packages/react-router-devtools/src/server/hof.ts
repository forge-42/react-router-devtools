import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"
import { analyzeLoaderOrAction, analyzeMiddleware } from "./utils"

// biome-ignore lint/suspicious/noExplicitAny: can be any type
export const withLoaderWrapper = (loader: (args: LoaderFunctionArgs) => Promise<any>, id: string) => {
	return analyzeLoaderOrAction(id, "loader", loader)
}

// biome-ignore lint/suspicious/noExplicitAny: can be any type
export const withActionWrapper = (action: (args: ActionFunctionArgs) => Promise<any>, id: string) => {
	return analyzeLoaderOrAction(id, "action", action)
}

// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
export const withMiddlewareWrapper = (middlewares: any[], routeId: string): any => {
	return middlewares.map((middleware, index) => analyzeMiddleware(middleware, routeId, index))
}

// Single middleware wrapper for use by AST transformation
export const withMiddlewareWrapperSingle = (
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
	middleware: any,
	routeId: string,
	index: number,
	middlewareName: string
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
): any => {
	return analyzeMiddleware(middleware, routeId, index, middlewareName)
}
