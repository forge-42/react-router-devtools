import { type SymbolsElement, useSymbolsStore } from "../store/Symbols.js"
import type { TagType } from "../store/Types.js"
import { useSymbolsRender } from "../utils/useRender.js"

export const BracketsRight = (props: SymbolsElement<TagType>) => {
	const { BracketsRight: Comp = {} } = useSymbolsStore()
	useSymbolsRender(Comp, props, "BracketsRight")

	return null
}

BracketsRight.displayName = "JVR.BracketsRight"
