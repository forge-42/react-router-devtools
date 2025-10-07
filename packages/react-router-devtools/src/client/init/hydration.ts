function removeStyleAndDataAttributes(inputString: string) {
	// Define the regular expressions to match <style>...</style> tags
	const styleTagRegex = /<style\b[^>]*>[\s\S]*?<\/style>/gi
	const scriptTagRegex = /<script\b[^>]*>[\s\S]*?<\/script>/gi
	const templateRegex = /<template\b[^>]*>[\s\S]*?<\/template>/gi
	const styleRegex = /style="([^"]*)"/g

	let resultString = inputString
		.replaceAll(styleTagRegex, "")
		.replaceAll(scriptTagRegex, "")
		.replaceAll(templateRegex, "")
		.replaceAll("<!--$?-->", "")
		.replaceAll("<!--/$-->", "")

	resultString = resultString.replaceAll(styleRegex, (_match, styleValue) => {
		// Add a semicolon at the end of the style attribute if it doesn't already exist and remove spacing to remove false positives
		const updatedStyle = styleValue.trim().endsWith(";") ? styleValue : `${styleValue};`
		return `style="${updatedStyle.replaceAll(" ", "")}"`
	})
	return resultString
}

declare global {
	interface Window {
		HYDRATION_OVERLAY: {
			SSR_HTML: string | undefined
			CSR_HTML: string | undefined
			ERROR: boolean | undefined
			APP_ROOT_SELECTOR: string
		}
	}
}

export const hydrationDetector = () => {
	if (typeof window !== "undefined") {
		if (!window.HYDRATION_OVERLAY) {
			// biome-ignore lint/suspicious/noExplicitAny: we want to init the object
			window.HYDRATION_OVERLAY = {} as any
		}
		window.addEventListener("error", (event) => {
			const msg = event.message.toLowerCase()

			const isHydrationMsg =
				msg.includes("hydration") || msg.includes("hydrating") || msg.includes("minified react error #418")

			if (isHydrationMsg) {
				window.HYDRATION_OVERLAY.ERROR = true

				const appRootEl = document.querySelector("html")

				if (appRootEl) {
					window.HYDRATION_OVERLAY.CSR_HTML = removeStyleAndDataAttributes(appRootEl.outerHTML)
				}
			}
		})
	}

	const HYDRATION_OVERLAY_ELEMENT = typeof document !== "undefined" && document.querySelector("html")

	if (HYDRATION_OVERLAY_ELEMENT) {
		window.HYDRATION_OVERLAY.SSR_HTML = removeStyleAndDataAttributes(HYDRATION_OVERLAY_ELEMENT.outerHTML)
	}
}
