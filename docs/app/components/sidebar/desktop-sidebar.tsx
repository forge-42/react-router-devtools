import type { SidebarTree } from "~/utils/create-sidebar-tree"
import { cn } from "~/utils/css"
import { SidebarContent } from "./sidebar-content"

export const DesktopSidebarPanel = ({ sidebarTree, className }: { sidebarTree: SidebarTree; className: string }) => (
	<div
		className={cn(
			"sticky top-[var(--header-height)] flex h-[calc(100vh-var(--header-height))] w-80 flex-col overflow-hidden bg-[var(--color-background)] p-4",
			className
		)}
	>
		<SidebarContent sidebarTree={sidebarTree} />
	</div>
)
