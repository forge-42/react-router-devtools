import { type SymbolsElement, useSymbolsStore } from "../store/Symbols.js"
import type { TagType } from "../store/Types.js"
import { useSymbolsRender } from "../utils/useRender.js"

export const Colon = (props: SymbolsElement<TagType>) => {
	const { Colon: Comp = {} } = useSymbolsStore()
	useSymbolsRender(Comp, props, "Colon")

	return null
}

Colon.displayName = "JVR.Colon"
