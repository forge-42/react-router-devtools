import type { ReactNode } from "react"
import { cx, useStyles } from "../styles/use-styles.js"

export const InfoCard = ({
	children,
	title,
	onClear,
}: {
	children: ReactNode
	title: string
	onClear?: () => void
}) => {
	const { styles } = useStyles()
	return (
		<div className={styles.infoCard.container}>
			<h3 className={cx(styles.infoCard.header, onClear && styles.infoCard.headerWithClear)}>
				{title}
				{onClear && typeof import.meta.hot === "undefined" && (
					<button type="button" onClick={onClear} className={styles.infoCard.clearButton}>
						Clear
					</button>
				)}
			</h3>

			{children}
		</div>
	)
}
