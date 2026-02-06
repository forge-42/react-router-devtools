import { memo } from "react"
import { useStyles } from "../styles/use-styles.js"

interface TabContentProps {
	children: React.ReactNode
}

export const TabContent = memo(({ children }: TabContentProps) => {
	const { styles } = useStyles()
	return <div className={styles.tabContent.container}>{children}</div>
})
