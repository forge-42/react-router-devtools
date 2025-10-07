export function getDomain(request: Request) {
	const url = new URL(request.url)
	const domain = url.origin
	return { domain }
}
