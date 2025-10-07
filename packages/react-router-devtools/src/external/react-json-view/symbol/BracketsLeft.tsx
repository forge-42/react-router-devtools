import { type SymbolsElement, useSymbolsStore } from "../store/Symbols.js"
import type { TagType } from "../store/Types.js"
import { useSymbolsRender } from "../utils/useRender.js"

export const BracketsLeft = (props: SymbolsElement<TagType>) => {
	const { BracketsLeft: Comp = {} } = useSymbolsStore()
	useSymbolsRender(Comp, props, "BracketsLeft")

	return null
}

BracketsLeft.displayName = "JVR.BracketsLeft"
