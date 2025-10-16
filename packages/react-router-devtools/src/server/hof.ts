import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"
import { analyzeLoaderOrAction } from "./utils"

// biome-ignore lint/suspicious/noExplicitAny: can be any type
export const withLoaderWrapper = (loader: (args: LoaderFunctionArgs) => Promise<any>, id: string) => {
	return analyzeLoaderOrAction(id, "loader", loader)
}

// biome-ignore lint/suspicious/noExplicitAny: can be any type
export const withActionWrapper = (action: (args: ActionFunctionArgs) => Promise<any>, id: string) => {
	return analyzeLoaderOrAction(id, "action", action)
}
