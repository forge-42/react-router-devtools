import { useTranslation } from "react-i18next"
import { Icon } from "~/ui/icon/icon"
import { cn } from "~/utils/css"
import type { HistoryItem } from "../search-types"
import { SearchResultRow } from "./search-result"
interface SearchHistoryProps {
	history: HistoryItem[]
	onSelect: (item: HistoryItem) => void
	onRemove: (id: string) => void
	onClear: () => void
}

const SearchHistoryHeader = ({ onClear }: Pick<SearchHistoryProps, "onClear">) => {
	const { t } = useTranslation()
	return (
		<div
			className={cn(
				"flex items-center justify-between border-[var(--color-history-header-border)] border-b",
				"bg-[var(--color-history-header-bg)] px-4 py-3"
			)}
		>
			<div className="flex items-center gap-2">
				<Icon name="Clock" className="size-4 text-[var(--color-result-meta)]" />
				<span className="font-medium text-[var(--color-history-header-text)] text-sm">{t("text.recent_searches")}</span>
			</div>
			<ClearHistoryButton onClear={onClear} />
		</div>
	)
}

const ClearHistoryButton = ({ onClear }: Pick<SearchHistoryProps, "onClear">) => {
	const { t } = useTranslation()
	return (
		<button
			type="button"
			onClick={onClear}
			className={cn(
				"flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
				"text-[var(--color-result-meta)] hover:bg-[var(--color-history-clear-hover-bg)] hover:text-[var(--color-history-clear-hover-text)]"
			)}
			title="Clear history"
			aria-label="Clear search history"
		>
			<Icon name="Trash2" className="size-3" />
			<span className="hidden sm:inline">{t("buttons.clear")}</span>
		</button>
	)
}

const RemoveItemButton = ({
	onRemove,
	id,
}: {
	onRemove: Pick<SearchHistoryProps, "onRemove">["onRemove"]
	id: string
}) => (
	<button
		type="button"
		onClick={(e) => {
			e.stopPropagation()
			onRemove(id)
		}}
		className={cn(
			"-translate-y-1/2 absolute top-1/2 right-2 flex h-6 w-6 items-center justify-center rounded-full border opacity-0 transition-all duration-150 group-hover:opacity-100",
			"border-[var(--color-history-remove-border)] bg-[var(--color-history-remove-bg)] text-[var(--color-history-remove-text)]",
			"hover:border-[var(--color-history-remove-hover-border)] hover:text-[var(--color-history-remove-hover-text)]"
		)}
		title="Remove from history"
		aria-label={"Remove from history"}
	>
		<Icon name="X" className="size-3" />
	</button>
)

const HistoryItemRow = ({
	item,
	index,
	onSelect,
	onRemove,
}: {
	item: HistoryItem
	index: number
	onSelect: Pick<SearchHistoryProps, "onSelect">["onSelect"]
	onRemove: Pick<SearchHistoryProps, "onRemove">["onRemove"]
}) => (
	<div key={`${item.id}-${index}`} className="group relative">
		<SearchResultRow
			item={item}
			highlightedText={item.highlightedText ?? item.title}
			isSelected={false}
			onClick={() => onSelect(item)}
			matchType={item.type ?? "heading"}
		/>
		<RemoveItemButton onRemove={onRemove} id={item.id} />
	</div>
)

const HistoryItemsList = ({
	history,
	onSelect,
	onRemove,
}: {
	history: HistoryItem[]
	onSelect: Pick<SearchHistoryProps, "onSelect">["onSelect"]
	onRemove: Pick<SearchHistoryProps, "onRemove">["onRemove"]
}) => (
	<div className="max-h-64 overflow-y-auto">
		{history.map((item, index) => (
			<HistoryItemRow key={`${item.id}-${index}`} item={item} index={index} onSelect={onSelect} onRemove={onRemove} />
		))}
	</div>
)

export const SearchHistory = ({ history, onSelect, onRemove, onClear }: SearchHistoryProps) => {
	if (history.length === 0) return null
	return (
		<div>
			<SearchHistoryHeader onClear={onClear} />
			<HistoryItemsList history={history} onSelect={onSelect} onRemove={onRemove} />
		</div>
	)
}
