import { Icon } from "~/ui/icon/icon"
import { cn } from "~/utils/css"

export const TriggerButton = ({
	onOpen,
	placeholder,
}: {
	onOpen: () => void
	placeholder: string
}) => (
	<button
		type="button"
		onClick={onOpen}
		className={cn(
			"group flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm shadow-sm transition-all duration-200 xl:px-3 xl:py-2",
			"border-[var(--color-trigger-border)] bg-[var(--color-trigger-bg)] text-[var(--color-trigger-text)]",
			"hover:border-[var(--color-trigger-hover-border)] hover:bg-[var(--color-trigger-hover-bg)] hover:shadow-md",
			"focus:border-[var(--color-trigger-focus-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-trigger-focus-ring)]"
		)}
	>
		<Icon
			name="Search"
			className={cn("size-4 transition-colors", "group-hover:text-[var(--color-trigger-hover-text)]")}
		/>
		<span className="hidden xl:inline">{placeholder}</span>
		<div className="ml-auto hidden items-center gap-1 xl:flex">
			<kbd
				className={cn(
					"rounded border border-[var(--color-kbd-border)] bg-[var(--color-kbd-bg)] px-1.5 py-0.5 font-mono text-xs",
					"text-[var(--color-kbd-text)]"
				)}
			>
				⌘
			</kbd>
			<kbd
				className={cn(
					"rounded border border-[var(--color-kbd-border)] bg-[var(--color-kbd-bg)] px-1.5 py-0.5 font-mono text-xs",
					"text-[var(--color-kbd-text)]"
				)}
			>
				K
			</kbd>
		</div>
	</button>
)
