import GithubContributeLinks from "~/components/github-contribute-links"
import PageMdxArticle from "~/components/page-mdx-article"
import { PageNavigation } from "~/components/page-navigation"
import { TableOfContents } from "~/components/table-of-content"
import { useDocumentationLayoutLoaderData } from "~/hooks/use-documentation-layout-loader-data"
import { usePreviousNextPages } from "~/hooks/use-previous-next-pages"
import { extractHeadingTreeFromMarkdown } from "~/utils/extract-heading-tree-from-mdx"
import { getDomain } from "~/utils/get-domain"
import { getContent } from "~/utils/load-content"
import { buildDocPathFromSlug, buildDocSlug } from "~/utils/path-builders"
import { generateMetaFields } from "~/utils/seo"
import { normalizeVersion } from "~/utils/version-resolvers"
import type { Route } from "./+types/documentation-page"

export const meta = ({ data }: Route.MetaArgs) => {
	const { page, domain, version } = data
	const docPath = buildDocPathFromSlug(page.slug)
	const fullPath = `/${[version, docPath.replace(/^\//, "")].filter(Boolean).join("/")}`

	return generateMetaFields({
		domain,
		path: fullPath,
		title: `${page.title} · React Router Devtools`,
		description: page.description,
	})
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const { version: v, section, subsection, filename } = params
	if (!filename) throw new Response("Not Found", { status: 404 })

	const { version } = normalizeVersion(v)
	const slug = buildDocSlug({ section, subsection, filename })

	const { allPages } = await getContent(version)
	const page = allPages.find((p) => p.slug === slug)
	if (!page) throw new Response("Not Found", { status: 404 })

	const { domain } = getDomain(request)
	return { page, version, domain }
}

export default function DocumentationPage({ loaderData }: Route.ComponentProps) {
	const { page } = loaderData
	const { sidebarTree } = useDocumentationLayoutLoaderData()
	const { previous, next } = usePreviousNextPages(sidebarTree)
	const toc = extractHeadingTreeFromMarkdown(page.rawMdx)

	return (
		<div className="flex min-h-screen flex-row ">
			<div className="mx-auto flex w-full max-w-screen-4xl flex-col gap-4 pt-4 lg:gap-8 xl:pt-0">
				<PageMdxArticle page={page} />
				<PageNavigation previous={previous} next={next} />
			</div>
			<aside className="hidden w-56 min-w-min flex-shrink-0 xl:block">
				<div className="sticky top-37 pb-10">
					<GithubContributeLinks pagePath={page._meta.filePath} />
					<TableOfContents items={toc} />
				</div>
			</aside>
		</div>
	)
}
