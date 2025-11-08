import { useEffect } from "react"
import type { ActionEvent, LoaderEvent } from "../../server/event-queue.js"
import { eventClient } from "../../shared/event-client.js"
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
	const { server, setServerInfo } = useServerInfo()

	// Listen to loader and action events from the event client
	useEffect(() => {
		// Listen to loader events
		const unsubscribeLoader = eventClient.on("loader-event", (event) => {
			const routes: ServerInfo["routes"] = { ...server?.routes }
			updateRouteInfo(server, routes, { type: "loader", data: event.payload as LoaderEvent["data"] }, false)
			setServerInfo({ routes })
		})

		// Listen to action events
		const unsubscribeAction = eventClient.on("action-event", (event) => {
			const routes: ServerInfo["routes"] = { ...server?.routes }
			updateRouteInfo(server, routes, { type: "action", data: event.payload as ActionEvent["data"] }, false)
			setServerInfo({ routes })
		})

		return () => {
			unsubscribeLoader()
			unsubscribeAction()
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
