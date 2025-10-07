import { type ReactNode, useEffect, useRef } from "react"
import { useScrollLock } from "~/hooks/use-scroll-lock"
import { cn } from "~/utils/css"
import { Backdrop } from "./backdrop"

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
	className?: string
	getInitialFocus?: () => HTMLElement | null
	restoreFocus?: boolean
	ariaLabel?: string
}

export const Modal = ({
	isOpen,
	onClose,
	children,
	className,
	getInitialFocus,
	restoreFocus = true,
	ariaLabel,
}: ModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null)
	const previouslyFocusedRef = useRef<HTMLElement | null>(null)

	useScrollLock(isOpen)

	useEffect(() => {
		if (!isOpen) return
		previouslyFocusedRef.current = document.activeElement as HTMLElement | null
		return () => {
			if (restoreFocus) previouslyFocusedRef.current?.focus?.()
		}
	}, [isOpen, restoreFocus])

	useEffect(() => {
		if (!isOpen) return
		const id = requestAnimationFrame(() => {
			const candidate = getInitialFocus?.()
			if (candidate) {
				candidate.focus()
				return
			}
			const root = modalRef.current
			if (!root) return
			const firstFocusable = root.querySelector<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
			firstFocusable?.focus()
		})
		return () => cancelAnimationFrame(id)
	}, [isOpen, getInitialFocus])

	useEffect(() => {
		if (!isOpen) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
			<Backdrop onClose={onClose} />
			<div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24">
				<div
					ref={modalRef}
					aria-modal="true"
					{...(ariaLabel ? { "aria-label": ariaLabel } : {})}
					className={cn(
						"w-full max-w-2xl transform overflow-hidden rounded-xl border-[var(--color-modal-border)] bg-[var(--color-modal-bg)] shadow-[0_25px_50px_-12px_var(--color-modal-shadow)] transition-all duration-200",
						className
					)}
					onMouseDown={(e) => e.stopPropagation()}
					onClick={(e) => e.stopPropagation()}
				>
					{children}
				</div>
			</div>
		</div>
	)
}
