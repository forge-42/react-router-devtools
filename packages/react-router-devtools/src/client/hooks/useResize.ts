import { useCallback, useEffect, useState } from "react"
import { useSettingsContext } from "../context/useRDTContext.js"

const useResize = () => {
	const { setSettings, settings } = useSettingsContext()
	const { height, maxHeight, minHeight, panelLocation } = settings
	const [isResizing, setIsResizing] = useState(false)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const enableResize = useCallback(() => {
		setIsResizing(true)
	}, [setIsResizing])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const disableResize = useCallback(() => {
		setIsResizing(false)
	}, [setIsResizing])

	const resize = useCallback(
		(e: MouseEvent) => {
			if (isResizing) {
				window.getSelection()?.removeAllRanges() // Prevent text selection
				const newHeight = panelLocation === "top" ? e.clientY : window.innerHeight - e.clientY // Calculate the new height based on the mouse position

				//const newHeight = e.clientY; // You may want to add some offset here from props

				if (newHeight > maxHeight) {
					setSettings({ height: maxHeight })
					return
				}

				if (newHeight < minHeight) {
					setSettings({ height: minHeight })
					return
				}

				setSettings({ height: newHeight })
			}
		},
		[isResizing, maxHeight, minHeight, setSettings, panelLocation]
	)

	useEffect(() => {
		document.addEventListener("mousemove", resize)
		document.addEventListener("mouseup", disableResize)

		return () => {
			document.removeEventListener("mousemove", resize)
			document.removeEventListener("mouseup", disableResize)
		}
	}, [disableResize, resize])

	return { height, enableResize, disableResize, isResizing }
}

export { useResize }
