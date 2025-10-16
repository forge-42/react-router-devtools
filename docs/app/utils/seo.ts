import { generateMeta } from "@forge42/seo-tools/remix/metadata"
import type { MetaDescriptor } from "react-router"
import PackageLogo from "/rrd-mascott.png"

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
			siteName: "React Router Devtools",
			image: PackageLogo,
		},
		[
			// Open Graph
			{ property: "og:type", content: "website" },
			...(additionalData ?? []),
		]
	)
}
