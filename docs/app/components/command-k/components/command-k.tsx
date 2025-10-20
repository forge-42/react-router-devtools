import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Modal } from "~/components/modal"
import type { Version } from "~/utils/version-resolvers"
import { useKeyboardNavigation } from "../hooks/use-keyboard-navigation"
import { useModalState } from "../hooks/use-modal-state"
import { useSearch } from "../hooks/use-search"
import { useSearchHistory } from "../hooks/use-search-history"
import type { HistoryItem, MatchType, SearchResult } from "../search-types"
import { EmptyState } from "./empty-state"
import { ResultsFooter } from "./results-footer"
import { SearchHistory } from "./search-history"
import { SearchInput } from "./search-input"
import { SearchResultRow } from "./search-result"
import { TriggerButton } from "./trigger-button"

interface CommandPaletteProps {
	placeholder?: string
	version: Version
}

export const CommandK = ({ placeholder, version }: CommandPaletteProps) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const inputRef = useRef<HTMLInputElement>(null)
	const [query, setQuery] = useState("")
	const { isOpen, openModal, closeModal } = useModalState()
	const { history, addToHistory, clearHistory, removeFromHistory } = useSearchHistory(version)
	const { results, search } = useSearch({ version })

	const hasQuery = !!query.trim()
	const hasResults = !!results.length
	const hasHistory = !!history.length
	const searchPlaceholder = placeholder ?? t("placeholders.search_documentation")

	const handleClose = () => {
		closeModal()
		setQuery("")
		search("")
	}

	const navigateToPage = (id: string) => {
		const path = [version, id]
			.filter(Boolean)
			.map((s) => s.replace(/^\/+|\/+$/g, ""))
			.join("/")

		navigate(`/${path}`)
	}

	const handleResultSelect = (result: SearchResult) => {
		if (!isOpen) return
		const rowItem = result.item
		const matchType: MatchType = result.refIndex === 0 ? "heading" : "paragraph"
		const historyItem = {
			...rowItem,
			type: matchType,
			highlightedText: result.highlightedText,
		}

		addToHistory(historyItem)
		navigateToPage(rowItem.id)
		handleClose()
	}

	const handleHistorySelect = (item: HistoryItem) => {
		navigateToPage(item.id)
		handleClose()
	}

	const handleToggle = () => {
		isOpen ? handleClose() : openModal()
	}

	const { selectedIndex } = useKeyboardNavigation({
		isOpen,
		results,
		onSelect: handleResultSelect,
		onClose: handleClose,
		onToggle: handleToggle,
	})

	if (!isOpen) {
		return <TriggerButton onOpen={openModal} placeholder={searchPlaceholder} />
	}

	const renderBody = () => {
		if (hasQuery) {
			if (!hasResults) return <EmptyState query={query} />

			return results.map((result, index) => (
				<SearchResultRow
					key={`${result.item.id}-${result.refIndex}`}
					item={result.item}
					highlightedText={result.highlightedText}
					isSelected={index === selectedIndex}
					onClick={() => handleResultSelect(result)}
					matchType={result.refIndex === 0 ? "heading" : "paragraph"}
				/>
			))
		}

		if (hasHistory) {
			return (
				<SearchHistory
					history={history}
					onSelect={handleHistorySelect}
					onRemove={removeFromHistory}
					onClear={clearHistory}
				/>
			)
		}

		return <EmptyState />
	}

	return (
		<Modal isOpen={isOpen} onClose={handleClose} getInitialFocus={() => inputRef.current} ariaLabel={searchPlaceholder}>
			<SearchInput
				ref={inputRef}
				value={query}
				onChange={(val) => {
					setQuery(val)
					search(val.trim())
				}}
				placeholder={searchPlaceholder}
			/>
			<div className="max-h-96 overflow-y-auto overscroll-contain" aria-label={searchPlaceholder}>
				{renderBody()}
			</div>
			<ResultsFooter resultsCount={results.length} query={query} />
		</Modal>
	)
}
