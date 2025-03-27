import { getLatestFiber } from "bippy/core"
import { getFiberFromHostInstance, getFiberSource, getNearestHostFiber } from "bippy/source"
import { useAttachDocumentListener } from "./useAttachListener.js"
import { useDevServerConnection } from "./useDevServerConnection.js"

const useOpenElementSource = () => {
	const { sendJsonMessage } = useDevServerConnection()

	useAttachDocumentListener(
		"contextmenu",
		/* async */ (e: any) => {
			if (!e.shiftKey || !e) {
				return
			}
			/* 		const fiber = getNearestHostFiber(e)
		const fiber2 = getFiberFromHostInstance(fiber.srcElement)
		console.log(fiber)
		if (!fiber) return
		const latestFiber = getLatestFiber(fiber)
		const source = await getFiberSource(latestFiber)
		console.log(latestFiber, source) */
			e.stopPropagation()
			e.preventDefault()
			const target = e.target as HTMLElement
			const rdtSource = target?.getAttribute("data-source")

			if (rdtSource) {
				const [source, line, column] = rdtSource.split(":::")
				return sendJsonMessage({
					type: "open-source",
					data: { source, line, column },
				})
			}
			for (const key in e.target) {
				if (key.startsWith("__reactFiber")) {
					const fiberNode = (e.target as any)[key]

					const originalSource = fiberNode?._debugSource
					const source = fiberNode?._debugOwner?._debugSource ?? fiberNode?._debugSource
					const line = source?.fileName?.startsWith("/") ? originalSource?.lineNumber : source?.lineNumber
					const fileName = source?.fileName?.startsWith("/") ? originalSource?.fileName : source?.fileName
					if (fileName && line) {
						return sendJsonMessage({
							type: "open-source",
							data: { source: fileName, line, column: 0 },
						})
					}
				}
			}
		}
	)
}

export { useOpenElementSource }
