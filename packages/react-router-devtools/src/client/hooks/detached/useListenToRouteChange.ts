import { useEffect, useRef } from "react"
import { useLocation, useNavigate, useNavigation } from "react-router"
import { detachedModeSetup } from "../../context/RDTContext.js"
import { useDetachedWindowControls } from "../../context/useRDTContext.js"
import { getStorageItem, setStorageItem } from "../../utils/storage.js"
import { useAttachListener } from "../useAttachListener.js"

const LOCAL_STORAGE_ROUTE_KEY = "rdt_route"

export const setRouteInLocalStorage = (route: string) => setStorageItem(LOCAL_STORAGE_ROUTE_KEY, route)

const getRouteFromLocalStorage = () => getStorageItem(LOCAL_STORAGE_ROUTE_KEY)

export const useListenToRouteChange = () => {
	const { detachedWindowOwner } = useDetachedWindowControls()
	const location = useLocation()
	const navigate = useNavigate()
	const navigation = useNavigation()
	const locationRoute = location.pathname + location.search
	const navigationRoute = (navigation.location?.pathname ?? "") + (navigation.location?.search ?? "")
	const ref = useRef(locationRoute)
	const route = getRouteFromLocalStorage()

	// Used by the owner window only
	// biome-ignore lint/correctness/useExhaustiveDependencies: investigate if needed
	useEffect(() => {
		const { detachedWindowOwner } = detachedModeSetup()
		if (!detachedWindowOwner) {
			return
		}
		// If the route changes and this is the original window store the event into local storage
		if (route !== locationRoute) {
			setRouteInLocalStorage(locationRoute)
		}
	}, [locationRoute, detachedWindowOwner, route])

	// Used to sync the route between the routes
	useAttachListener("storage", "window", (e: any) => {
		// We only care about the key that changes the route
		if (e.key !== LOCAL_STORAGE_ROUTE_KEY) {
			return
		}

		const route = getRouteFromLocalStorage()

		if (route && route !== ref.current && route !== navigationRoute && navigation.state === "idle") {
			ref.current = route
			navigate(route)
		}
	})
}
