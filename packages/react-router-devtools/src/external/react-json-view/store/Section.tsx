import type React from "react"
import {
	type ComponentPropsWithoutRef,
	type FC,
	type PropsWithChildren,
	createContext,
	useContext,
	useReducer,
} from "react"
import type { TagType } from "./Types.js"

export type SectionElementProps<T extends TagType> = {
	as?: T
	render?: (props: SectionElement<T>, result: { value: unknown; keyName: string | number }) => React.ReactNode
}

export type SectionElement<T extends TagType> = SectionElementProps<T> & ComponentPropsWithoutRef<T>

type InitialState<T extends TagType> = {
	Copied?: SectionElement<T>
	CountInfo?: SectionElement<T>
	CountInfoExtra?: SectionElement<T>
	Ellipsis?: SectionElement<T>
	KeyName?: SectionElement<T>
}

type Dispatch = React.Dispatch<InitialState<TagType>>
const initialState: InitialState<TagType> = {
	Copied: {
		className: "w-rjv-copied",
		style: {
			height: "1em",
			width: "1em",
			cursor: "pointer",
			verticalAlign: "middle",
			marginLeft: 5,
		},
	},
	CountInfo: {
		as: "span",
		className: "w-rjv-object-size",
		style: {
			color: "var(--w-rjv-info-color, #0000004d)",
			paddingLeft: 8,
			fontStyle: "italic",
		},
	},
	CountInfoExtra: {
		as: "span",
		className: "w-rjv-object-extra",
		style: {
			paddingLeft: 8,
		},
	},
	Ellipsis: {
		as: "span",
		style: {
			cursor: "pointer",
			color: "var(--w-rjv-ellipsis-color, #cb4b16)",
			userSelect: "none",
		},
		className: "w-rjv-ellipsis",
		children: "...",
	},
	KeyName: {
		as: "span",
		className: "w-rjv-object-key",
	},
}

const Context = createContext<InitialState<TagType>>(initialState)
const reducer = (state: InitialState<TagType>, action: InitialState<TagType>) => ({
	...state,
	...action,
})

export const useSectionStore = () => {
	return useContext(Context)
}

const DispatchSection = createContext<Dispatch>(() => {})
DispatchSection.displayName = "JVR.DispatchSection"

export function useSection() {
	return useReducer(reducer, initialState)
}

export function useSectionDispatch() {
	return useContext(DispatchSection)
}

interface SectionProps {
	initial: InitialState<TagType>
	dispatch: Dispatch
}

export const Section: FC<PropsWithChildren<SectionProps>> = ({ initial, dispatch, children }) => {
	return (
		<Context.Provider value={initial}>
			<DispatchSection.Provider value={dispatch}>{children}</DispatchSection.Provider>
		</Context.Provider>
	)
}

Section.displayName = "JVR.Section"
