import GithubContributeLinks from "~/components/github-contribute-links"
import PageMdxArticle from "~/components/page-mdx-article"
import { getDomain } from "~/utils/get-domain"
import { getContent } from "~/utils/load-content"
import { generateMetaFields } from "~/utils/seo"
import { resolveVersionForHomepage } from "~/utils/version-resolvers"
import type { Route } from "./+types/documentation-homepage"

export const meta = ({ data }: Route.MetaArgs) => {
	const { page, domain, version } = data
	const title = page.title
	const description = page.description
	return generateMetaFields({
		domain,
		path: `/${version}/home`,
		title: `${title} · React Router Devtools`,
		description,
	})
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const { version } = resolveVersionForHomepage(params.version)
	const { allPages } = await getContent(version)
	const page = allPages.find((p) => p._meta.path === "_index")
	if (!page) throw new Response("Not Found", { status: 404 })
	const { domain } = getDomain(request)
	return { page, version, domain }
}

export default function DocumentationHomepage({ loaderData }: Route.ComponentProps) {
	const { page } = loaderData
	return (
		<div className="flex min-h-screen flex-row">
			<div className="mx-auto flex w-full max-w-screen-4xl gap-4 pt-4 lg:gap-8 xl:pt-0">
				<PageMdxArticle page={page} />
			</div>
			<div className="hidden w-56 min-w-min flex-shrink-0 xl:block">
				<div className="sticky top-37 pb-10">
					<GithubContributeLinks pagePath={page._meta.filePath} />
				</div>
			</div>
		</div>
	)
}
