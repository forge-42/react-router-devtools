import type { ReactNode } from "react"
import { cx, useStyles } from "../styles/use-styles.js"

interface TabHeaderProps {
	icon: ReactNode
	title: string
	rightContent?: ReactNode
	gradientDirection?: "ltr" | "rtl"
}

export const TabHeader = ({ icon, title, rightContent, gradientDirection = "ltr" }: TabHeaderProps) => {
	const { styles } = useStyles()
	return (
		<div className={cx(styles.tabHeader.container, gradientDirection === "rtl" && styles.tabHeader.containerRtl)}>
			<div className={styles.tabHeader.leftContent}>
				{icon}
				<h2 className={styles.tabHeader.title}>{title}</h2>
			</div>
			{rightContent && <div className={styles.tabHeader.rightContent}>{rightContent}</div>}
		</div>
	)
}
