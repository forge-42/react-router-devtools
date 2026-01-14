import { memo } from "react"
import { cx } from "../styles/use-styles.js"
import { useStyles } from "../styles/use-styles.js"

interface MainPanelProps {
	children: React.ReactNode
	isOpen: boolean
	isEmbedded?: boolean
	className?: string
}

const MainPanel = memo(({ children, isOpen, className }: MainPanelProps) => {
	const { styles } = useStyles()

	return (
		<div
			data-testid="react-router-devtools-main-panel"
			style={{
				zIndex: 9998,
			}}
			className={cx(
				styles.layout.mainPanel.container,
				isOpen ? styles.layout.mainPanel.open : styles.layout.mainPanel.closed,
				className
			)}
		>
			{children}
		</div>
	)
})

export { MainPanel }
