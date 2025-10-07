import { useTranslation } from "react-i18next"
import { cn } from "~/utils/css"
import { KeyboardHint } from "./keyboard-hint"
import { ResultsFooterNote } from "./results-footer-note"

export const ResultsFooter = ({
	resultsCount,
	query,
}: {
	resultsCount: number
	query: string
}) => {
	const { t } = useTranslation()
	if (!query || resultsCount === 0) return null

	return (
		<div className={cn("border-[var(--color-footer-border)] border-t bg-[var(--color-footer-bg)] px-4 py-3")}>
			<div className="flex items-center justify-between text-xs">
				<span className="font-medium text-[var(--color-footer-text)]">{t("text.result", { count: resultsCount })}</span>
				<div className="flex items-center gap-4 text-[var(--color-footer-text)]">
					<KeyboardHint keys={["↑", "↓"]} label={t("controls.navigate")} />
					<KeyboardHint keys="↵" label={t("controls.select")} />
					<ResultsFooterNote />
				</div>
			</div>
		</div>
	)
}
