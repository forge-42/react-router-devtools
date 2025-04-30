import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"
import { analyzeLoaderOrAction } from "./utils"

export const withLoaderWrapper = (loader: (args: LoaderFunctionArgs) => Promise<any>, id: string) => {
	return analyzeLoaderOrAction(id, "loader", loader)
}

export const withActionWrapper = (action: (args: ActionFunctionArgs) => Promise<any>, id: string) => {
	return analyzeLoaderOrAction(id, "action", action)
}
