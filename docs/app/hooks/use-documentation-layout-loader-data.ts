import { useRouteLoaderData } from "react-router"
import type { Route } from "../routes/+types/documentation-layout"

export const useDocumentationLayoutLoaderData = () => {
	const data = useRouteLoaderData<Route.ComponentProps["loaderData"]>("routes/documentation-layout")
	if (!data) {
		throw new Error(
			"useDocumentationLayoutLoaderData must be used inside a route that is a child of 'documentation-layout' route"
		)
	}
	return data
}
