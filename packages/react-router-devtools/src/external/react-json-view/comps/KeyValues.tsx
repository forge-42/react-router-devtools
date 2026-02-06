import { Fragment, useId, useRef } from "react"
import { Container } from "../Container.js"
import { KeyNameComp } from "../section/KeyName.js"
import { useStore } from "../store.js"
import { useExpandsStore } from "../store/Expands.js"
import { useShowToolsDispatch } from "../store/ShowTools.js"
import { Colon, Quote } from "../symbol/index.js"
import { useHighlight } from "../utils/useHighlight.js"
import { Value } from "./Value.js"

interface KeyValuesProps<T extends object> {
	keyName?: string | number
	value?: T
	parentValue?: T
	expandKey?: string
	level: number
}

export const KeyValues = <T extends object>(props: KeyValuesProps<T>) => {
	const { value, expandKey = "", level } = props
	const expands = useExpandsStore()
	const { objectSortKeys, indentWidth, collapsed } = useStore()
	const isMyArray = Array.isArray(value)
	const isExpanded =
		expands[expandKey] ??
		(typeof collapsed === "boolean" ? collapsed : typeof collapsed === "number" ? level > collapsed : false)
	if (isExpanded) {
		return null
	}
	// object
	let entries: [key: string | number, value: T][] = isMyArray
		? Object.entries(value).map((m) => [Number(m[0]), m[1]])
		: Object.entries(value as T)
	if (objectSortKeys) {
		entries =
			objectSortKeys === true
				? entries.sort(([a], [b]) => (typeof a === "string" && typeof b === "string" ? a.localeCompare(b) : 0))
				: entries.sort(([a, valA], [b, valB]) =>
						typeof a === "string" && typeof b === "string" ? objectSortKeys(a, b, valA, valB) : 0
					)
	}

	const style = {
		borderLeft: "var(--w-rjv-border-left-width, 1px) var(--w-rjv-line-style, solid) var(--w-rjv-line-color, #ebebeb)",
		paddingLeft: indentWidth,
		marginLeft: 6,
	}
	return (
		<div className="w-rjv-wrap" style={style}>
			{entries.map(([key, val], idx) => {
				return <KeyValuesItem parentValue={value} keyName={key} value={val} key={idx} level={level} />
			})}
		</div>
	)
}

KeyValues.displayName = "JVR.KeyValues"

type KayNameProps<T extends object> = Omit<KeyValuesProps<T>, "level">
export const KayName = <T extends object>(props: KayNameProps<T>) => {
	const { keyName, value } = props
	const { highlightUpdates } = useStore()
	const isNumber = typeof keyName === "number"
	const highlightContainer = useRef<HTMLSpanElement>(null)
	useHighlight({ value, highlightUpdates, highlightContainer })
	return (
		<Fragment>
			<span ref={highlightContainer}>
				<Quote isNumber={isNumber} data-placement="left" />
				<KeyNameComp keyName={keyName!} value={value}>
					{keyName}
				</KeyNameComp>
				<Quote isNumber={isNumber} data-placement="right" />
			</span>
			<Colon />
		</Fragment>
	)
}

KayName.displayName = "JVR.KayName"

const KeyValuesItem = <T extends object>(props: KeyValuesProps<T>) => {
	const { keyName, value, parentValue, level = 0 } = props
	const dispatch = useShowToolsDispatch()
	const subkeyid = useId()
	const isMyArray = Array.isArray(value)
	const isMySet = value instanceof Set
	const isMyMap = value instanceof Map
	const isDate = value instanceof Date
	const isUrl = value instanceof URL
	const isMyObject = value && typeof value === "object" && !isMyArray && !isMySet && !isMyMap && !isDate && !isUrl
	const isNested = isMyObject || isMyArray || isMySet || isMyMap
	if (isNested) {
		const myValue = isMySet ? Array.from(value as Set<any>) : isMyMap ? Object.fromEntries(value) : value
		return (
			<Container keyName={keyName} value={myValue} parentValue={parentValue} initialValue={value} level={level + 1} />
		)
	}
	const reset: React.HTMLAttributes<HTMLDivElement> = {
		onMouseEnter: () => dispatch({ [subkeyid]: true }),
		onMouseLeave: () => dispatch({ [subkeyid]: false }),
	}
	return (
		<div className="w-rjv-line" {...reset}>
			<KayName keyName={keyName} value={value} />
			<Value keyName={keyName!} value={value} expandKey={subkeyid} />
		</div>
	)
}

KeyValuesItem.displayName = "JVR.KeyValuesItem"
