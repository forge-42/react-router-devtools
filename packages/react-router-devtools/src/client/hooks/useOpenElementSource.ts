import { openSource } from "../utils/open-source.js"
import { useAttachDocumentListener } from "./useAttachListener.js"

const useOpenElementSource = () => {
	// biome-ignore lint/suspicious/noExplicitAny: this should be fixed
	useAttachDocumentListener("contextmenu", (e: any) => {
		if (!e.shiftKey || !e) {
			return
		}

		e.stopPropagation()
		e.preventDefault()
		const target = e.target as HTMLElement
		const rdtSource = target?.getAttribute("data-rrdt-source")

		if (rdtSource) {
			const [source, line, column] = rdtSource.split(":")
			return openSource(source, line, column)
		}
		for (const key in e.target) {
			if (key.startsWith("__reactFiber")) {
				// biome-ignore lint/suspicious/noExplicitAny: we don't know the type  (this should be fixed)
				const fiberNode = (e.target as any)[key]

				const originalSource = fiberNode?._debugSource
				const source = fiberNode?._debugOwner?._debugSource ?? fiberNode?._debugSource
				const line = source?.fileName?.startsWith("/") ? originalSource?.lineNumber : source?.lineNumber

				const fileName = source?.fileName?.startsWith("/") ? originalSource?.fileName : source?.fileName
				if (fileName && line) {
					return openSource(fileName, line)
				}
			}
		}
	})
}

export { useOpenElementSource }
