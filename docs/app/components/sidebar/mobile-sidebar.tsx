import { useParams } from "react-router"
import { useDocumentationLayoutLoaderData } from "~/hooks/use-documentation-layout-loader-data"
import { BreadcrumbItem, Breadcrumbs } from "~/ui/breadcrumbs"
import { IconButton } from "~/ui/icon-button"
import { Icon } from "~/ui/icon/icon"
import type { SidebarTree } from "~/utils/create-sidebar-tree"
import { cn } from "~/utils/css"
import { buildBreadcrumbs } from "./build-breadcrumbs"
import { useMobileSidebar } from "./mobile-sidebar-context"
import { SidebarContent } from "./sidebar-content"

const MobileSidebarMenuButton = () => {
	const { open } = useMobileSidebar()

	return (
		<IconButton
			name={"Menu"}
			onClick={open}
			className="text-[var(--color-text-normal)] transition-colors duration-200 hover:text-[var(--color-text-hover)]"
			aria-label="Navigation menu"
		/>
	)
}

export const MobileSidebarHeader = () => {
	const params = useParams()
	const {
		sidebarTree: { sections, documentationPages },
	} = useDocumentationLayoutLoaderData()
	const { section, subsection, filename } = params
	const currentPath = `/${[section, subsection, filename].filter(Boolean).join("/")}`
	const breadcrumbs = buildBreadcrumbs(sections, currentPath, documentationPages)
	return (
		<div className="fixed z-40 flex h-fit w-full items-center gap-3 border-[var(--color-border)] border-b-2 bg-[var(--color-background)] px-4 py-2">
			<MobileSidebarMenuButton />
			<Breadcrumbs className="text-xs sm:text-sm md:text-base">
				{breadcrumbs.map((item) => (
					<BreadcrumbItem key={item}>{item}</BreadcrumbItem>
				))}
			</Breadcrumbs>
		</div>
	)
}

export const MobileSidebarOverlay = () => {
	const { isOpen, close } = useMobileSidebar()

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: We don't need keyboard support for this overlay
		<div
			className={`fixed inset-0 z-40 bg-black transition-opacity duration-500 ${
				isOpen ? "opacity-50" : "pointer-events-none opacity-0"
			}`}
			onClick={close}
			aria-hidden="true"
		/>
	)
}

const MobileSidebarCloseButton = () => {
	const { close } = useMobileSidebar()

	return (
		<button
			type="button"
			onClick={close}
			className="absolute top-2 right-4 z-10 rounded-full p-2 text-[var(--color-text-normal)] transition-colors duration-200 hover:text-[var(--color-text-hover)]"
			aria-label="Close navigation menu"
		>
			<Icon name="X" className="size-5" />
		</button>
	)
}

export const MobileSidebarPanel = ({
	sidebarTree,
	className,
}: {
	sidebarTree: SidebarTree
	className: string
}) => {
	const { close, isOpen } = useMobileSidebar()
	return (
		<div
			className={cn(
				"fixed left-0 z-50 flex h-[calc(100vh-var(--header-height))] w-80 flex-col overflow-hidden bg-[var(--color-background)] p-4 transition-transform duration-500 ease-in-out",
				isOpen ? "translate-x-0" : "-translate-x-full",
				className
			)}
			aria-label="Navigation menu"
		>
			<SidebarContent sidebarTree={sidebarTree} onClose={close} />
			<MobileSidebarCloseButton />
		</div>
	)
}
