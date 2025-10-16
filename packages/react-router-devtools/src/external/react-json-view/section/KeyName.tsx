import type { FC, PropsWithChildren } from "react"
import { type SectionElement, useSectionStore } from "../store/Section.js"
import type { TagType } from "../store/Types.js"
import { useSectionRender } from "../utils/useRender.js"

export const KeyName = <K extends TagType>(props: SectionElement<K>) => {
	const { KeyName: Comp = {} } = useSectionStore()
	useSectionRender(Comp, props, "KeyName")
	return null
}

KeyName.displayName = "JVR.KeyName"

type KeyNameCompProps = {
	keyName: string | number
	value?: unknown
}

export const KeyNameComp: FC<PropsWithChildren<KeyNameCompProps>> = (props) => {
	const { children, value, keyName } = props
	const isNumber = typeof children === "number"
	const style: React.CSSProperties = {
		color: isNumber ? "var(--w-rjv-key-number, #268bd2)" : "var(--w-rjv-key-string, #002b36)",
	}
	const { KeyName: Comp = {} } = useSectionStore()
	const { as, render, ...reset } = Comp
	reset.style = { ...reset.style, ...style }
	const Elm = as || "span"
	const child = render && typeof render === "function" && render({ ...reset, children }, { value, keyName })
	if (child) return child
	return <Elm {...reset}>{children}</Elm>
}

KeyNameComp.displayName = "JVR.KeyNameComp"
