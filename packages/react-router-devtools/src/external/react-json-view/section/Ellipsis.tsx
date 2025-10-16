import { type SectionElement, useSectionStore } from "../store/Section.js"
import type { TagType } from "../store/Types.js"
import { useSectionRender } from "../utils/useRender.js"

export const Ellipsis = <K extends TagType>(props: SectionElement<K>) => {
	const { Ellipsis: Comp = {} } = useSectionStore()
	useSectionRender(Comp, props, "Ellipsis")
	return null
}

Ellipsis.displayName = "JVR.Ellipsis"

interface EllipsisCompProps<T extends object> {
	value?: T
	keyName: string | number
	isExpanded: boolean
}

export const EllipsisComp = <T extends object>({ isExpanded, value, keyName }: EllipsisCompProps<T>) => {
	const { Ellipsis: Comp = {} } = useSectionStore()
	const { as, render, ...reset } = Comp
	const Elm = as || "span"
	const child =
		render && typeof render === "function" && render({ ...reset, "data-expanded": isExpanded }, { value, keyName })
	if (child) return child
	if (!isExpanded) return null
	return <Elm {...reset} />
}

EllipsisComp.displayName = "JVR.EllipsisComp"
