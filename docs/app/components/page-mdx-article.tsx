import type { Page } from "content-collections-types"
import { Title } from "~/ui/title"
import { MDXWrapper } from "./mdx-wrapper"

export default function PageMdxArticle({ page }: { page: Page }) {
	return (
		<article className="prose prose-invert w-full min-w-0 max-w-4xl flex-grow px-3 py-3 prose-headings:text-[var(--color-text-active)] prose-p:text-[var(--color-text-active)] leading-7 md:leading-8 text-base md:px-6 md:py-4 md:text-lg xl:leading-9">
			<header className=" border-[var(--color-border)] border-b">
				<Title className="mt-0 font-bold text-[var(--color-text-heading)]" as="h1">
					{page.title}
				</Title>
				{page.description && (
					<p className="my-6 font-normal text-[var(--color-text-muted)] text-base sm:text-lg md:text-xl leading-7 md:leading-8  xl:leading-9">
						{page.description}
					</p>
				)}
			</header>
			<MDXWrapper content={page.content} />
		</article>
	)
}
