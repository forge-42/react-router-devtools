import { href, useNavigate } from "react-router"
import { Header } from "~/components/header"
import { Logo } from "~/components/logo"
import { Icon } from "~/ui/icon/icon"
import { getDomain } from "~/utils/get-domain"
import { generateMetaFields } from "~/utils/seo"
import { getLatestVersion } from "~/utils/version-resolvers"
import type { Route } from "./+types"

export const meta = ({ data }: Route.MetaArgs) => {
	const { domain } = data
	return generateMetaFields({
		domain,
		path: "/",
		title: "Docs Template",
		description:
			"Modern, versioned documentation with instant search, first-class SEO, and LLM-friendly endpoints out of the box.",
	})
}

export async function loader({ request }: Route.LoaderArgs) {
	const { domain } = getDomain(request)
	return { domain }
}

type CardDef = {
	icon: React.ComponentProps<typeof Icon>["name"]
	title: string
	body: string
	href?: string
}

const CARDS: CardDef[] = [
	{
		icon: "FileText",
		title: "Content Collections",
		body: "Write docs in Markdown or MDX. Navigation, versioning, and structure are generated automatically.",
	},
	{
		icon: "Search",
		title: "Instant Search",
		body: "Fast full-text search with keyboard shortcuts and fuzzy matching for quick discovery.",
	},
	{
		icon: "Palette",
		title: "Themeable",
		body: "Light and dark themes included. Customize colors and styles with a few CSS variables.",
	},
	{
		icon: "Code",
		title: "Code Blocks",
		body: "Readable code examples with syntax highlighting, copy button, and diff support.",
	},
	{
		icon: "Bot",
		title: "LLM-Ready (llms.txt)",
		body: "Serve a clear llms.txt so AI tools know where to find the right docs and what to ignore.",
		href: "/llms.txt",
	},
	{
		icon: "ShieldCheck",
		title: "SEO Essentials",
		body: "Automatic per-page meta tags, OpenGraph/Twitter cards, robots.txt, and XML sitemaps.",
		href: "/sitemap-index.xml",
	},
]

function Card({ icon, title, body, href }: CardDef) {
	return (
		<a
			href={href}
			className="group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2c8794]"
		>
			<div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#2c8794] to-[#329baa]">
				<Icon name={icon} className="size-6 text-white" />
			</div>
			<h3 className="mb-2 font-semibold text-[var(--color-text-active)] text-lg">{title}</h3>
			<p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{body}</p>
			{href ? (
				<span className="mt-3 inline-flex items-center gap-1 font-medium text-[var(--color-text-active)] text-sm">
					Learn more <Icon name="ChevronRight" className="size-4" />
				</span>
			) : null}
		</a>
	)
}

//  FIXME Customize this page
export default function Index() {
	const navigate = useNavigate()

	return (
		<div className="flex min-h-screen flex-col bg-[var(--color-background)] 2xl:container 2xl:mx-auto">
			<Header>
				<Logo>
					<span className="p-0">DOCS TEMPLATE</span>
				</Logo>
			</Header>

			<main className="flex flex-1 items-center justify-center">
				<div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-info-border)] bg-[var(--color-info-bg)] px-3 py-1 text-[var(--color-info-text)] text-sm">
						<Icon name="Zap" className="size-4" />
						Version {getLatestVersion()} now available
					</div>

					<h1 className="font-bold text-2xl text-[var(--color-text-active)] leading-snug md:text-3xl xl:text-4xl">
						Modern Documentation{" "}
						<span className="bg-gradient-to-r from-[#48ddf3] to-[#fb4bb5] bg-clip-text text-transparent">
							Made Simple
						</span>
					</h1>

					<p className="max-w-2xl text-[var(--color-text-muted)] text-lg leading-relaxed">
						Build fast, accessible docs with React Router v7, Content Collections, and Tailwind—plus first-class SEO and
						LLM signals.
					</p>

					<div className="mb-2 grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{CARDS.map((c) => (
							<Card key={c.title} {...c} />
						))}
					</div>

					<div className="mt-6 flex items-center justify-center gap-4">
						<button
							type="button"
							onClick={() => navigate(href("/:version?/home"))}
							className="flex items-center gap-2 rounded-lg bg-[#2c8794] px-6 py-3 font-medium text-white transition-colors hover:bg-[#329baa]"
						>
							<Icon name="Rocket" className="size-5" />
							Get started
						</button>

						<a
							href="https://github.com/forge42/docs-template"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 rounded-lg bg-[var(--color-background-active)] px-6 py-3 font-medium text-[var(--color-text-active)] transition-colors hover:bg-[var(--color-border)]"
						>
							<Icon name="Github" className="size-5" />
							View on GitHub
						</a>
					</div>

					<p className="mt-8 text-[var(--color-text-muted)] text-sm">
						Built with ❤️ by the{" "}
						<a
							href="https://forge42.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-[var(--color-text)]"
						>
							Forge 42 team
						</a>
					</p>
				</div>
			</main>
		</div>
	)
}
