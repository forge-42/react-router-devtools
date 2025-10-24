import { useCallback, useEffect } from "react"
import { useMatches } from "react-router"
import { ROUTE_BOUNDARY_GRADIENTS } from "../context/rdtReducer.js"
import { useSettingsContext } from "../context/useRDTContext.js"
import { useStyles } from "../styles/use-styles.js"
import { useAttachListener } from "./useAttachListener.js"
import { ROUTE_CLASS } from "./useReactTreeListeners.js"

export const useSetRouteBoundaries = () => {
	const matches = useMatches()
	const { settings, setSettings } = useSettingsContext()
	const { styles } = useStyles()

	const applyOrRemoveClasses = useCallback(
		(isHovering?: boolean) => {
			// Overrides the hovering so the classes are force removed if needed
			const hovering = isHovering ?? settings.isHoveringRoute
			// Get the Goober gradient class for the selected gradient
			const gradientKey = ROUTE_BOUNDARY_GRADIENTS[settings.routeBoundaryGradient]
			const gradientClass = styles.gradients[gradientKey as keyof typeof styles.gradients]

			const isRoot = settings.hoveredRoute === "root"
			// We get all the elements with this class name, the last one is the one we want because strict mode applies 2x divs
			const elements = isRoot ? document.getElementsByTagName("body") : document.getElementsByClassName(ROUTE_CLASS)

			const element = isRoot
				? elements.item(elements.length - 1)
				: elements.item(matches.length - 1 - Number.parseInt(settings.hoveredRoute))

			if (element) {
				// Root has no outlet so we need to use the body, otherwise we get the outlet that is the next sibling of the element
				const outlet = element
				// Apply or remove the Goober gradient class
				if (hovering) {
					outlet.classList.add(gradientClass)
				} else {
					outlet.classList.remove(gradientClass)
				}
			}
		},
		[settings.hoveredRoute, settings.isHoveringRoute, settings.routeBoundaryGradient, matches.length, styles.gradients]
	)
	// Mouse left the document => remove classes => set isHovering to false so that detached mode removes as well
	useAttachListener("mouseleave", "document", () => {
		if (settings.showRouteBoundariesOn === "click") {
			return
		}
		applyOrRemoveClasses()

		setSettings({
			isHoveringRoute: false,
		})
	})
	// Mouse is scrolling => remove classes => set isHovering to false so that detached mode removes as well
	useAttachListener("wheel", "window", () => {
		if (settings.showRouteBoundariesOn === "click") {
			return
		}
		applyOrRemoveClasses(false)

		setSettings({
			isHoveringRoute: false,
		})
	})
	// We apply/remove classes on state change which happens in Page tab
	// biome-ignore lint/correctness/useExhaustiveDependencies: investigate
	useEffect(() => {
		if (!settings.isHoveringRoute && !settings.hoveredRoute) return
		applyOrRemoveClasses()
		if (!settings.isHoveringRoute) {
			setSettings({
				hoveredRoute: "",
				isHoveringRoute: false,
			})
		}
	}, [
		settings.hoveredRoute,
		settings.isHoveringRoute,
		settings.routeBoundaryGradient,
		applyOrRemoveClasses,
		setSettings,
	])
}
