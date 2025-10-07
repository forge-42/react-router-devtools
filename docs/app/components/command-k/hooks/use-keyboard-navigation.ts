import { useEffect, useState } from "react"
import type { SearchResult } from "../search-types"

const KEYBOARD_SHORTCUTS = {
	TOGGLE: "k",
	ESCAPE: "Escape",
	ARROW_DOWN: "ArrowDown",
	ARROW_UP: "ArrowUp",
	ENTER: "Enter",
	TAB: "Tab",
} as const

interface UseKeyboardNavigationProps {
	isOpen: boolean
	results: SearchResult[]
	onSelect: (result: SearchResult) => void
	onClose: () => void
	onToggle: () => void
}

export const useKeyboardNavigation = ({ isOpen, results, onSelect, onClose, onToggle }: UseKeyboardNavigationProps) => {
	const [selectedIndex, setSelectedIndex] = useState(0)

	useEffect(() => {
		setSelectedIndex(0)
	}, [])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === KEYBOARD_SHORTCUTS.TOGGLE) {
				e.preventDefault()
				onToggle()
				return
			}

			if (e.key === KEYBOARD_SHORTCUTS.ESCAPE) {
				onClose()
				return
			}

			if (!isOpen) return

			switch (e.key) {
				case KEYBOARD_SHORTCUTS.ARROW_DOWN:
					e.preventDefault()
					setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
					break

				case KEYBOARD_SHORTCUTS.ARROW_UP:
					e.preventDefault()
					setSelectedIndex((prev) => Math.max(prev - 1, 0))
					break

				case KEYBOARD_SHORTCUTS.ENTER:
					e.preventDefault()
					if (results[selectedIndex]) {
						onSelect(results[selectedIndex])
					}
					break

				case KEYBOARD_SHORTCUTS.TAB:
					e.preventDefault()
					setSelectedIndex((prev) => (prev + 1) % results.length)
					break
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [isOpen, results, selectedIndex, onSelect, onClose, onToggle])

	return { selectedIndex }
}
