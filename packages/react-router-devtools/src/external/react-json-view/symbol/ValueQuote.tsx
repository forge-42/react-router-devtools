import { type SymbolsElement, useSymbolsStore } from "../store/Symbols.js"
import type { TagType } from "../store/Types.js"
import { useSymbolsRender } from "../utils/useRender.js"

export const ValueQuote = (props: SymbolsElement<TagType>) => {
	const { ValueQuote: Comp = {} } = useSymbolsStore()
	useSymbolsRender(Comp, props, "ValueQuote")

	return null
}

ValueQuote.displayName = "JVR.ValueQuote"
