import { useTranslation } from "react-i18next"
import { KeyboardHint } from "./keyboard-hint"
import { ResultsFooterNote } from "./results-footer-note"

export const EmptyState = ({ query }: { query?: string }) => {
	const { t } = useTranslation()
	if (query) {
		return (
			<div className="px-4 py-8 text-center">
				<p className="font-medium text-[var(--color-empty-text)]">
					{t("text.no_results_for")} "{query}"
				</p>
				<p className="mt-1 text-[var(--color-empty-text-muted)] text-sm">{t("text.adjust_search")}</p>
			</div>
		)
	}

	return (
		<div className="space-y-6 px-4 py-8 text-center">
			<p className="mb-4 font-medium text-[var(--color-empty-text)]">{t("text.start_typing_to_search")}</p>
			<div className="flex items-center justify-center gap-6 text-[var(--color-empty-text-muted)] text-xs">
				<KeyboardHint keys={["↑", "↓"]} label={t("controls.navigate")} />
				<KeyboardHint keys="↵" label={t("controls.select")} />
				<KeyboardHint keys="⇥" label={t("controls.cycle")} />
			</div>
			<ResultsFooterNote />
		</div>
	)
}
