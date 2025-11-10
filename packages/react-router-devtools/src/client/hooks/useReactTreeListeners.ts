import { type Fiber, onCommitFiberRoot, traverseFiber } from "bippy"
import { useCallback, useEffect } from "react"
import { useNavigation } from "react-router"

export const ROUTE_CLASS = "outlet-route"

export function useReactTreeListeners() {
	const navigation = useNavigation()

	// biome-ignore lint/suspicious/noExplicitAny:  we don't know the type
	const styleNearestElement = useCallback((fiberNode: Fiber<any> | null) => {
		if (!fiberNode) return

		if (fiberNode.stateNode) {
			return fiberNode.stateNode?.classList?.add(ROUTE_CLASS)
		}
		styleNearestElement(fiberNode?.child)
	}, [])

	useEffect(() => {
		if (navigation.state !== "idle") return

		onCommitFiberRoot((root) =>
			traverseFiber(root.current, (fiberNode) => {
				if (fiberNode?.elementType?.name === "default" || fiberNode?.elementType?.name === "RenderedRoute") {
					styleNearestElement(fiberNode)
				}
			})
		)
	}, [navigation.state, styleNearestElement])
}
