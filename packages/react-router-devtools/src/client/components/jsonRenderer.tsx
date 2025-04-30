import { useEffect, useMemo, useRef, useState } from "react"
import JsonView from "../../external/react-json-view/index.js"
import { customTheme } from "../../external/react-json-view/theme/custom.js"
import { useSettingsContext } from "../context/useRDTContext.js"

interface JsonRendererProps {
	data: string | Record<string, unknown>
	expansionLevel?: number
}

const isPromise = (value: any): value is Promise<any> => {
	return value && typeof value.then === "function"
}

const JsonRenderer = ({ data, expansionLevel }: JsonRendererProps) => {
	const { settings } = useSettingsContext()
	const ref = useRef(true)
	useEffect(() => {
		ref.current = true
		return () => {
			ref.current = false
		}
	}, [])
	const originalData = useMemo(
		() =>
			typeof data === "string"
				? data
				: Object.entries(data)
						.map(([key, value]) => {
							if (isPromise(value)) {
								value
									.then((res) => {
										if (!ref.current) return
										setJson((json: any) => ({
											...json,
											[key]: res,
										}))
									})
									.catch((e) => {})
								return { [key]: "Loading deferred data..." }
							}
							return { [key]: value }
						})
						.reduce((acc, curr) => {
							// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
							return { ...acc, ...curr }
						}, {}),
		[data]
	)

	const [json, setJson] = useState(originalData)

	useEffect(() => {
		let mounted = true
		if (mounted) {
			setJson(data)
		}
		return () => {
			mounted = false
		}
	}, [data])

	if (typeof json === "string") {
		return <div className="rdt-max-w-xs rdt-text-green-600">{json}</div>
	}

	return (
		<JsonView highlightUpdates style={customTheme} collapsed={expansionLevel ?? settings.expansionLevel} value={json} />
	)
}

export { JsonRenderer }
