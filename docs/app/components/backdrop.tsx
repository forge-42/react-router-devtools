import { cn } from "~/utils/css"

export const Backdrop = ({ onClose, className }: { onClose: () => void; className?: string }) => (
	// biome-ignore lint/a11y/useKeyWithClickEvents: We don't need keyboard events for backdrop
	<div
		className={cn(
			"fixed inset-0 z-50 bg-[var(--color-modal-backdrop)] backdrop-blur-sm transition-opacity duration-200",
			className
		)}
		onClick={(e) => {
			if (e.target === e.currentTarget) {
				onClose()
			}
		}}
	/>
)
