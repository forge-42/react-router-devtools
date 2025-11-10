import { useCallback, useEffect } from "react"
import { useNavigation } from "react-router"

export const ROUTE_CLASS = "outlet-route"

export function useReactTreeListeners() {
	const navigation = useNavigation()

	// biome-ignore lint/suspicious/noExplicitAny: we don't know the type
	const traverseComponentTree = useCallback((fiberNode: any, callback: any) => {
		callback(fiberNode)

		let child = fiberNode.child
		while (child) {
			traverseComponentTree(child, callback)
			child = child.sibling
		}
	}, [])

	// biome-ignore lint/suspicious/noExplicitAny: we don't know the type
	const styleNearestElement = useCallback((fiberNode: any) => {
		if (!fiberNode) return

		if (fiberNode.stateNode) {
			return fiberNode.stateNode.classList.add(ROUTE_CLASS)
		}
		styleNearestElement(fiberNode.child)
	}, [])

	useEffect(() => {
		if (navigation.state !== "idle") return
		// biome-ignore lint/suspicious/noExplicitAny: accessing React internals
		const devTools = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__

		for (const [rendererID] of devTools.renderers) {
			const fiberRoots = devTools.getFiberRoots(rendererID)
			for (const rootFiber of fiberRoots) {
				// biome-ignore lint/suspicious/noExplicitAny: we don't know the type
				traverseComponentTree(rootFiber.current, (fiberNode: any) => {
					if (fiberNode?.elementType?.name === "default" || fiberNode?.elementType?.name === "RenderedRoute") {
						styleNearestElement(fiberNode)
					}
				})
			}
		}
	}, [navigation.state, styleNearestElement, traverseComponentTree])
}
