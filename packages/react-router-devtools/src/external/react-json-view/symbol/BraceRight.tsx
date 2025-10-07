import { type SymbolsElement, useSymbolsStore } from "../store/Symbols.js"
import type { TagType } from "../store/Types.js"
import { useSymbolsRender } from "../utils/useRender.js"

export const BraceRight = (props: SymbolsElement<TagType>) => {
	const { BraceRight: Comp = {} } = useSymbolsStore()
	useSymbolsRender(Comp, props, "BraceRight")
	return null
}

BraceRight.displayName = "JVR.BraceRight"
