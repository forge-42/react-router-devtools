/**
 * Helper utility used to extract the domain from the request even if it's
 * behind a proxy. This is useful for sitemaps and other things.
 * @param request Request object
 * @returns Current domain
 */
export const createDomain = (request: Request) => {
	const headers = request.headers
	const maybeProto = headers.get("x-forwarded-proto")
	const maybeHost = headers.get("host")
	const url = new URL(request.url)
	// If the request is behind a proxy, we need to use the x-forwarded-proto and host headers
	// to get the correct domain
	if (maybeProto) {
		return `${maybeProto}://${maybeHost ?? url.host}`
	}
	// If we are in local development, return the localhost
	if (url.hostname === "localhost") {
		return `http://${url.host}`
	}
	// If we are in production, return the production domain
	return `https://${url.host}`
}
