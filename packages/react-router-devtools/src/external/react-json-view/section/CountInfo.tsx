import { useStore } from "../store.js"
import { type SectionElement, type SectionElementProps, useSectionStore } from "../store/Section.js"
import type { TagType } from "../store/Types.js"
import { useSectionRender } from "../utils/useRender.js"

export const CountInfo = <K extends TagType>(props: SectionElement<K>) => {
	const { CountInfo: Comp = {} } = useSectionStore()
	useSectionRender(Comp, props, "CountInfo")
	return null
}

CountInfo.displayName = "JVR.CountInfo"

interface CountInfoCompProps<T extends object> {
	value?: T
	keyName: string | number
}

export const CountInfoComp = <T extends object>(
	props: SectionElementProps<TagType> & CountInfoCompProps<T> & React.HTMLAttributes<HTMLElement>
) => {
	const { value = {}, keyName, ...other } = props
	const { displayObjectSize } = useStore()

	const { CountInfo: Comp = {} } = useSectionStore()

	if (!displayObjectSize) return null

	const { as, render, ...reset } = Comp
	const Elm = as || "span"

	reset.style = { ...reset.style, ...props.style }

	const len = Object.keys(value).length
	if (!reset.children) {
		reset.children = `${len} items`
	}

	const elmProps = { ...reset, ...other }
	const isRender = render && typeof render === "function"
	const child = isRender && render({ ...elmProps, "data-length": len }, { value, keyName })
	if (child) return child
	return <Elm {...elmProps} />
}

CountInfoComp.displayName = "JVR.CountInfoComp"
