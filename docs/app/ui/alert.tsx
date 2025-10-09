import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "~/utils/css"
import { Icon } from "./icon/icon"

interface AlertProps {
	children: ReactNode
	title?: string
	variant: "info" | "warning"
	className?: string
}

export const Alert = ({ children, title, variant, className = "" }: AlertProps) => {
	const { t } = useTranslation()
	const getVariantStyles = () => {
		switch (variant) {
			case "info":
				return {
					container: "bg-[var(--color-info-bg)] border-[var(--color-info-border)] border-l-4",
					title: "text-[var(--color-info-text)]",
					content: "text-[var(--color-info-text)]",
					icon: "text-[var(--color-info-icon)]",
				}
			case "warning":
				return {
					container: "bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] border-l-4",
					title: "text-[var(--color-warning-text)]",
					content: "text-[var(--color-warning-text)]",
					icon: "text-[var(--color-warning-icon)]",
				}
			default:
				return {
					container: "",
					title: "",
					content: "",
					icon: "",
				}
		}
	}

	const getIcon = () => {
		switch (variant) {
			case "info":
				return <Icon name="Info" className="size-6" />
			case "warning":
				return <Icon name="TriangleAlert" className="size-6" />
			default:
				return null
		}
	}

	const styles = getVariantStyles()
	const defaultTitle = variant === "info" ? t("titles.good_to_know") : t("titles.warning")

	return (
		<div className={cn("my-6 flex flex-col gap-2 rounded-xl border p-4 md:p-6", styles.container, className)}>
			<div className="inline-flex items-center gap-2">
				<div className={cn("inline-flex", styles.icon)}>{getIcon()}</div>
				<p className={cn("mt-0 mb-0 font-semibold text-sm leading-6 sm:text-base md:text-lg", styles.title)}>{title || defaultTitle}</p>
			</div>

			<div
				className={cn(
					"prose prose-xs sm:prose-sm md:prose-base max-w-none text-sm leading-6 sm:text-base md:text-lg",
					styles.content
				)}
			>
				{children}
			</div>
		</div>
	)
}
