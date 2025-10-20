import { generateMeta } from "@forge42/seo-tools/remix/metadata"
import type { MetaDescriptor } from "react-router"
import PackageLogo from "/static/images/package-logo-1200x630.png"

interface MetaFields {
	domain: string
	title: string
	description: string
	path: string
	additionalData?: MetaDescriptor[]
}

export function generateMetaFields({ domain, title, description, path, additionalData }: MetaFields) {
	const fullUrl = `${domain}${path}`

	return generateMeta(
		{
			title,
			description,
			url: fullUrl,
			// FIXME Change to your package name
			siteName: "Docs Template",
			// FIXME Change to your image
			image: PackageLogo,
		},
		[
			// Open Graph
			{ property: "og:type", content: "website" },
			...(additionalData ?? []),
		]
	)
}
