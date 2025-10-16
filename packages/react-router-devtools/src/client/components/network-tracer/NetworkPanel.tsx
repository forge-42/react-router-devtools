import { useEffect, useState } from "react"
import { useRequestContext } from "../../context/requests/request-context"

import NetworkWaterfall from "./NetworkWaterfall"

function NetworkPanel() {
	const { requests } = useRequestContext()

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
		<div className=" text-gray-100">
			<div className="mx-auto p-1">
				<div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
					<div className="border-t border-gray-700 p-4 network-container">
						<NetworkWaterfall requests={requests} width={containerWidth - 32} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default NetworkPanel
