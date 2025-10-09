import { cn } from "~/utils/css"

export const Backdrop = ({ onClose }: { onClose: () => void }) => (
	// biome-ignore lint/a11y/useKeyWithClickEvents: We don't need keyboard events for backdrop
	<div
		className={cn("fixed inset-0 bg-[var(--color-modal-backdrop)] backdrop-blur-sm transition-opacity duration-200 z-50")}
		onClick={(e) => {
			if (e.target === e.currentTarget) {
				onClose()
			}
		}}
	/>
)
