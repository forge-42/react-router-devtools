import { type TagType, type TypesElement, useTypesStore } from "../store/Types.js"
import { useTypesRender } from "../utils/useRender.js"

export const Set = (props: TypesElement<TagType>) => {
	const { Set: Comp = {} } = useTypesStore()
	useTypesRender(Comp, props, "Set")

	return null
}

Set.displayName = "JVR.Set"
