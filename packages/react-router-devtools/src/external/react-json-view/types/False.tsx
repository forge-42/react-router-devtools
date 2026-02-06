import { type TagType, type TypesElement, useTypesStore } from "../store/Types.js"
import { useTypesRender } from "../utils/useRender.js"

export const False = (props: TypesElement<TagType>) => {
	const { False: Comp = {} } = useTypesStore()
	useTypesRender(Comp, props, "False")

	return null
}

False.displayName = "JVR.False"
