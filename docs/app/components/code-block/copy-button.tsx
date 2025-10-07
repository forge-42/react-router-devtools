import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Icon } from "~/ui/icon/icon"
import { cn } from "~/utils/css"
import { processCopyContent } from "./code-block-parser"

export const CopyButton = ({ lines }: { lines: string[] }) => {
	const [copyState, setCopyState] = useState<"copy" | "copied">("copy")
	const disabled = copyState === "copied"
	const { t } = useTranslation()

	const handleCopy = async () => {
		const reconstructedContent = lines.join("\n")
		const { code } = processCopyContent(reconstructedContent)

		await navigator.clipboard.writeText(code)
		setCopyState("copied")
		setTimeout(() => setCopyState("copy"), 2000)
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			disabled={disabled}
			className={cn(
				"absolute top-3 right-3 flex items-center gap-1 rounded px-2 py-1 text-xs transition-all sm:text-sm md:text-base",
				"bg-[var(--color-code-copy-bg)] text-[var(--color-code-copy-text)]",
				"opacity-0 group-hover:opacity-100",
				!disabled && "hover:bg-[var(--color-code-copy-hover-bg)]",
				disabled && "cursor-not-allowed hover:bg-[var(--color-code-copy-bg)]"
			)}
		>
			<Icon name={copyState === "copy" ? "ClipboardCopy" : "ClipboardCheck"} className="size-5" />
			{t(copyState === "copy" ? "buttons.copy" : "buttons.copied")}
		</button>
	)
}
