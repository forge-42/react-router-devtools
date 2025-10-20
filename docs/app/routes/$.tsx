import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Link } from "~/ui/link"
import type { Route } from "./+types/$"

export const loader = async ({ params }: Route.LoaderArgs) => {
	const slug = params["*"]
	return new Response(`Page with slug \"${slug}\" not found!`, { status: 404 })
}
export default function Route404() {
	const navigate = useNavigate()
	const { t } = useTranslation()
	return (
		<div className="relative flex h-full min-h-screen w-screen items-center justify-center bg-[var(--color-background)] sm:pt-8 sm:pb-16">
			<div className="relative mx-auto max-w-[90rem] sm:px-6 lg:px-8">
				<div className="relative flex min-h-72 flex-col items-center justify-center p-8 sm:overflow-hidden sm:rounded-2xl md:p-12 lg:p-16">
					<h1 className="mb-4 text-center font-bold text-4xl text-[var(--color-text-active)] sm:text-5xl">
						{t("error.404.title")}
					</h1>
					<p className="mb-8 max-w-2xl text-center text-[var(--color-text-muted)] text-lg">
						{t("error.404.description")}
					</p>

					<div className="flex gap-4">
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-5 py-2 font-medium text-[var(--color-text-normal)] text-sm transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text-hover)]"
						>
							{t("buttons.back")}
						</button>
						<Link
							to="/"
							className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background-active)] px-5 py-2 font-medium text-[var(--color-text-normal)] text-sm transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text-hover)]"
						>
							{t("buttons.home")}
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
