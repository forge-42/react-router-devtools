import { Outlet, useRouteLoaderData } from "react-router"
import { CommandK } from "~/components/command-k/components/command-k"
import { Header } from "~/components/header"
import { IconLink } from "~/components/icon-link"
import { Logo } from "~/components/logo"
import { Sidebar } from "~/components/sidebar/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { VersionDropdown } from "~/components/versions-dropdown"
import { createSidebarTree } from "~/utils/create-sidebar-tree"
import { resolveVersionForLayout } from "~/utils/version-resolvers"
import type { Route } from "./+types/documentation-layout"

export async function loader({ params, request }: Route.LoaderArgs) {
	const { version } = resolveVersionForLayout(params.version, request)
	const sidebarTree = await createSidebarTree(version)
	return { sidebarTree, version }
}
export default function DocumentationLayout({ loaderData }: Route.ComponentProps) {
	const { sidebarTree, version } = loaderData
	const { clientEnv } = useRouteLoaderData("root")
	const { GITHUB_REPO_URL } = clientEnv
	return (
		<div className="block min-h-screen bg-[var(--color-background)] 2xl:container 2xl:mx-auto">
			<Header>
				<div className="flex items-start gap-3">
					<Logo>
						<span className="p-0">React Router Devtools</span>
					</Logo>
				</div>
				<div className="inline-flex items-center gap-2 xl:gap-3">
					<VersionDropdown />
					<CommandK version={version} />
					<ThemeToggle />
					{GITHUB_REPO_URL && <IconLink name="Github" href={GITHUB_REPO_URL} />}
				</div>
			</Header>

			<div className="xl:flex">
				<Sidebar sidebarTree={sidebarTree} className="flex-shrink-0" />
				<main className="mx-4 flex-1 pt-10 pb-16 lg:mx-8">
					<Outlet />
				</main>
			</div>
		</div>
	)
}
