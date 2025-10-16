import { type SymbolsElement, useSymbolsStore } from "../store/Symbols.js"
import type { TagType } from "../store/Types.js"
import { useSymbolsRender } from "../utils/useRender.js"

export const Quote = (props: SymbolsElement<TagType>) => {
	const { Quote: Comp = {} } = useSymbolsStore()
	useSymbolsRender(Comp, props, "Quote")

	return null
}

Quote.displayName = "JVR.Quote"
