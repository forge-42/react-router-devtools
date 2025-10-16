interface GitHubContributionLinkOptions {
	pagePath: string
	owner: string
	repo: string
}

export function createGitHubContributionLinks({ pagePath, owner, repo }: GitHubContributionLinkOptions) {
	const githubBase = `https://github.com/${owner}/${repo}`
	const editUrl = `${githubBase}/edit/main/docs/content/${pagePath}`

	const issueTitle = `Issue with the "${pagePath}" doc`
	const issueBody = `I found an issue with this document.

**Title:** ${pagePath}
**Source:** ${githubBase}/blob/main/content/${pagePath}

### Describe the issue
<!-- Describe the issue and include the section you're referring to, if applicable. Provide lots of detail about the issue that you found. -->

### Additional info
<!-- Add any other context about the issue here. If applicable, add screenshots to help explain the issue. -->`

	const issueUrl = `${githubBase}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`

	return { editUrl, issueUrl }
}
