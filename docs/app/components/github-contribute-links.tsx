import { useTranslation } from "react-i18next"
import { useRouteLoaderData } from "react-router"
import { createGitHubContributionLinks } from "~/utils/create-github-contribution-links"

const linkStyles = "hover:text-[var(--color-text-accent)] hover:underline"

export default function GithubContributeLinks({ pagePath }: { pagePath: string }) {
	const { clientEnv } = useRouteLoaderData("root")
	const { t } = useTranslation()

	const { GITHUB_OWNER, GITHUB_REPO } = clientEnv

	if (!GITHUB_OWNER || !GITHUB_REPO) {
		return null
	}

	const { issueUrl, editUrl } = createGitHubContributionLinks({ pagePath, owner: GITHUB_OWNER, repo: GITHUB_REPO })
	return (
		<div className="mb-10 flex flex-col gap-3 text-[var(--color-text-active)] text-sm md:text-base">
			<a href={issueUrl} target="_blank" rel="noopener noreferrer" className={linkStyles}>
				{t("links.report_an_issue_on_this_page")}
			</a>
			<a href={editUrl} target="_blank" rel="noopener noreferrer" className={linkStyles}>
				{t("links.edit_this_page")}
			</a>
		</div>
	)
}
