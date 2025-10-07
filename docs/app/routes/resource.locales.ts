import { cacheHeader } from "pretty-cache-header"
import { z } from "zod"
import { type Language, type Namespace, resources } from "~/localization/resource"
import type { Route } from "./+types/resource.locales"

export async function loader({ request, context }: Route.LoaderArgs) {
	const { isProductionDeployment } = context
	const url = new URL(request.url)

	const lng = z
		.string()
		.refine((lng): lng is Language => Object.keys(resources).includes(lng))
		.parse(url.searchParams.get("lng"))

	const namespaces = resources[lng as Language]

	const ns = z
		.string()
		.refine((ns): ns is Namespace => {
			return Object.keys(resources[lng as Language]).includes(ns)
		})
		.parse(url.searchParams.get("ns"))

	const headers = new Headers()

	// On production, we want to add cache headers to the response
	if (isProductionDeployment) {
		headers.set(
			"Cache-Control",
			cacheHeader({
				maxAge: "5m",
				sMaxage: "1d",
				staleWhileRevalidate: "7d",
				staleIfError: "7d",
			})
		)
	}

	return Response.json(namespaces[ns as Namespace], { headers })
}
