import { useEffect } from "react"
import { useNavigation } from "react-router"
import type { ActionEvent, LoaderEvent } from "../../server/event-queue.js"
import type { ServerInfo } from "../context/rdtReducer.js"
import { useServerInfo } from "../context/useRDTContext.js"
import { cutArrayToLastN } from "../utils/common.js"

const updateRouteInfo = (
	server: ServerInfo | undefined,
	routes: ServerInfo["routes"],
	event: LoaderEvent | ActionEvent,
	includeServerInfo = true
) => {
	const { data, type } = event
	const { id, ...rest } = data
	// Get existing route
	const existingRouteInfo = !includeServerInfo ? routes?.[id] : (routes?.[id] ?? server?.routes?.[id])
	let newRouteData = [...(existingRouteInfo?.[type === "loader" ? "loaders" : "actions"] || []), rest]
	// Makes sure there are no more than 20 entries per loader/action
	newRouteData = cutArrayToLastN(newRouteData, 20)
	// Calculates the min, max and average execution time
	const { min, max, total } = newRouteData.reduce(
		(acc, dataPiece) => {
			return {
				min: Math.min(acc.min, dataPiece.executionTime),
				max: Math.max(acc.max, dataPiece.executionTime),
				total: acc.total + dataPiece.executionTime,
			}
		},
		{ min: 100000, max: 0, total: 0 }
	)

	const loaderTriggerCount = existingRouteInfo?.loaderTriggerCount || 0
	const actionTriggerCount = existingRouteInfo?.actionTriggerCount || 0
	// Updates the route info with the new data
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	routes![id] = {
		...existingRouteInfo,
		lowestExecutionTime: min,
		highestExecutionTime: max,
		averageExecutionTime: Number(Number(total / newRouteData.length).toFixed(2)),
		loaderTriggerCount: type === "loader" ? loaderTriggerCount + 1 : loaderTriggerCount,
		loaders: type === "loader" ? newRouteData : (existingRouteInfo?.loaders ?? []),
		actions: type === "action" ? newRouteData : (existingRouteInfo?.actions ?? []),
		lastLoader: type === "loader" ? rest : (existingRouteInfo?.lastLoader ?? {}),
		lastAction: type === "action" ? rest : (existingRouteInfo?.lastAction ?? {}),
		actionTriggerCount: type === "action" ? actionTriggerCount + 1 : actionTriggerCount,
	}
}

const useDevServerConnection = () => {
	const navigation = useNavigation()
	const { server, setServerInfo } = useServerInfo()

	// Pull the event queue from the server when the page is idle
	useEffect(() => {
		if (typeof import.meta.hot === "undefined") return
		if (navigation.state !== "idle") return
		// We send a pull & clear event to pull the event queue and clear it
		import.meta.hot.send("all-route-info")
	}, [navigation.state])

	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
		const cb2 = (data: any) => {
			const events = JSON.parse(data).data
			const routes: ServerInfo["routes"] = {}
			for (const routeInfo of Object.values(events)) {
				// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
				const { loader, action } = routeInfo as any
				const events = [
					// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
					loader.map((e: any) => ({ type: "loader", data: e })),
					// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
					action.map((e: any) => ({ type: "action", data: e })),
				].flat()
				for (const event of events) {
					updateRouteInfo(server, routes, event, false)
				}
			}

			setServerInfo({ routes })
		}
		if (typeof import.meta.hot !== "undefined") {
			import.meta.hot.on("all-route-info", cb2)
		}

		return () => {
			if (typeof import.meta.hot !== "undefined") {
				import.meta.hot.dispose(cb2)
			}
		}
	}, [server, setServerInfo])

	const isConnected = typeof import.meta.hot !== "undefined"

	return {
		// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
		sendJsonMessage: (data: any) => import.meta.hot?.send(data.type, data),
		connectionStatus: "Open" as const,
		isConnected,
	}
}

export { useDevServerConnection }
