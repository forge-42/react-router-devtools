import { Icon } from "~/ui/icon/icon"
import { cn } from "~/utils/css"
import type { MatchType, SearchRecord } from "../search-types"

interface SearchResultProps {
	item: SearchRecord
	highlightedText: string
	isSelected: boolean
	onClick: () => void
	matchType: MatchType
}

const ResultIcon = ({
	isSelected,
	matchType,
}: {
	isSelected: boolean
	matchType: MatchType
}) => {
	const iconName = matchType === "heading" ? "Hash" : "Pilcrow"

	return (
		<div
			className={cn(
				"mt-0.5 transition-transform duration-150",
				isSelected ? "text-[var(--color-result-icon-selected)]" : "text-[var(--color-result-icon)]"
			)}
		>
			<Icon name={iconName} className="size-4" />
		</div>
	)
}

const ResultTitle = ({
	title,
	highlightedText,
	isSelected,
}: {
	title: string
	highlightedText: string
	isSelected: boolean
}) => (
	<div
		className={cn(
			"font-medium leading-snug transition-transform duration-150",
			isSelected ? "text-[var(--color-result-selected-text)]" : "text-[var(--color-result-text)]"
		)}
	>
		{/* biome-ignore lint/security/noDangerouslySetInnerHtml: rendering text */}
		<span dangerouslySetInnerHTML={{ __html: highlightedText || title }} />
	</div>
)

const ResultMetadata = ({ item, matchType }: Pick<SearchResultProps, "item" | "matchType">) => (
	<div className="mt-2 text-[var(--color-breadcrumb-text)] text-sm">
		{item.title}
		{matchType === "paragraph" && item.subtitle ? <span> &gt; {item.subtitle}</span> : null}
	</div>
)

const ResultContent = ({ item, highlightedText, isSelected, matchType }: Omit<SearchResultProps, "onClick">) => (
	<div className="min-w-0 flex-1">
		<ResultTitle title={item.title} highlightedText={highlightedText} isSelected={isSelected} />
		<ResultMetadata item={item} matchType={matchType} />
	</div>
)

const useButtonStyles = (isSelected: boolean) =>
	cn(
		"flex w-full items-start gap-3 border-r-2 px-4 py-3 text-left transition-all duration-150",
		"hover:bg-[var(--color-result-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-trigger-focus-ring)]",
		isSelected
			? "border-[var(--color-result-selected-border)] bg-[var(--color-result-selected)] shadow-sm"
			: "border-transparent"
	)

export const SearchResultRow = ({ item, highlightedText, isSelected, onClick, matchType }: SearchResultProps) => {
	const buttonStyles = useButtonStyles(isSelected)

	return (
		<button type="button" onClick={onClick} className={buttonStyles}>
			<ResultIcon isSelected={isSelected} matchType={matchType} />
			<ResultContent item={item} highlightedText={highlightedText} isSelected={isSelected} matchType={matchType} />
		</button>
	)
}
