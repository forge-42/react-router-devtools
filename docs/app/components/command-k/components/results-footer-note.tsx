import { useTranslation } from "react-i18next"

export const ResultsFooterNote = () => {
	const { t } = useTranslation()
	return (
		<span className="text-[var(--color-footer-text)] text-sm opacity-70">
			{t("p.search_by")}{" "}
			<span className="font-semibold">
				<a href="https://www.forge42.dev/" target="_blank" rel="noopener noreferrer">
					Forge 42
				</a>
			</span>
		</span>
	)
}
