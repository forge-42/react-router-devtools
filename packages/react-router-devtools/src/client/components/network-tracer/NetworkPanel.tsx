import { useEffect, useState } from "react"
import { useRequestContext } from "../../context/requests/request-context"
import { cx } from "../../styles/use-styles"
import { useStyles } from "../../styles/use-styles"

import NetworkWaterfall from "./NetworkWaterfall"

function NetworkPanel() {
	const { requests } = useRequestContext()
	const { styles } = useStyles()
	const [containerWidth, setContainerWidth] = useState(800)

	// Simulate network requests for demo

	// Update container width on resize
	useEffect(() => {
		const updateWidth = () => {
			const container = document.querySelector(".network-container")
			if (container) {
				setContainerWidth(container.clientWidth)
			}
		}

		window.addEventListener("resize", updateWidth)
		updateWidth()

		return () => window.removeEventListener("resize", updateWidth)
	}, [])

	return (
		<div className={styles.network.panel.container}>
			<div className={styles.network.panel.innerContainer}>
				<div className={styles.network.panel.cardContainer}>
					<div className={cx(styles.network.panel.networkContainer, "network-container")}>
						<NetworkWaterfall requests={requests} width={containerWidth - 32} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default NetworkPanel
