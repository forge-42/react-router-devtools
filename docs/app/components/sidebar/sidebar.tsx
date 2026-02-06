import type { SidebarTree } from "~/utils/create-sidebar-tree"
import { cn } from "~/utils/css"
import { DesktopSidebarPanel } from "./desktop-sidebar"
import { MobileSidebarHeader, MobileSidebarOverlay, MobileSidebarPanel } from "./mobile-sidebar"
import { MobileSidebarProvider } from "./mobile-sidebar-context"

export type SidebarSection = {
	title: string
	slug: string
	subsections: SidebarSection[]
	documentationPages: { title: string; slug: string }[]
}

interface SidebarProps {
	sidebarTree: SidebarTree
	className?: string
}

export const Sidebar = ({ sidebarTree, className = "" }: SidebarProps) => {
	return (
		<>
			<DesktopSidebarPanel sidebarTree={sidebarTree} className={cn("hidden xl:block", className)} />
			<MobileSidebarProvider>
				<div className="xl:hidden">
					<MobileSidebarHeader />
					<MobileSidebarOverlay />
					<MobileSidebarPanel sidebarTree={sidebarTree} className={className} />
				</div>
			</MobileSidebarProvider>
		</>
	)
}
