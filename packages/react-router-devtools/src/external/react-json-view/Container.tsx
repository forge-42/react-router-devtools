import type React from "react"
import { forwardRef, useId } from "react"
import { KeyValues } from "./comps/KeyValues.js"
import { NestedClose } from "./comps/NestedClose.js"
import { NestedOpen } from "./comps/NestedOpen.js"
import { useShowToolsDispatch } from "./store/ShowTools.js"

interface ContainerProps<T extends object> extends React.HTMLAttributes<HTMLDivElement> {
	keyName?: string | number
	keyid?: string
	parentValue?: T
	level?: number
	value?: T
	initialValue?: T
}
export const Container = forwardRef(<T extends object>(props: ContainerProps<T>, ref: React.Ref<HTMLDivElement>) => {
	const { className = "", children, parentValue, keyid, level = 1, value, initialValue, keyName, ...elmProps } = props
	const dispatch = useShowToolsDispatch()
	const subkeyid = useId()
	const defaultClassNames = [className, "w-rjv-inner"].filter(Boolean).join(" ")
	const reset: React.HTMLAttributes<HTMLDivElement> = {
		onMouseEnter: () => dispatch({ [subkeyid]: true }),
		onMouseLeave: () => dispatch({ [subkeyid]: false }),
	}
	return (
		<div className={defaultClassNames} ref={ref} {...elmProps} {...reset}>
			<NestedOpen expandKey={subkeyid} value={value} level={level} keyName={keyName} initialValue={initialValue} />
			<KeyValues expandKey={subkeyid} value={value} level={level} />
			<NestedClose expandKey={subkeyid} value={value} level={level} />
		</div>
	)
})

Container.displayName = "JVR.Container"
