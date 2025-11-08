import { EventClient } from "@tanstack/devtools-event-client"
import type { ActionEvent, LoaderEvent } from "../server/event-queue.js"
import type { RequestEvent } from "./request-event"

type Route = {
	id: string
	file: string
	path?: string
	index?: boolean
	caseSensitive?: boolean
	children?: Route[]
	parentId?: string
}

interface EventMap {
	"rdt:request-event": RequestEvent
	"rdt:get-events": RequestEvent[] // Both request (empty array) and response (array of events)
	"rdt:remove-event": { id: string; startTime: number; fromClient?: boolean }
	"rdt:loader-event": LoaderEvent["data"]
	"rdt:action-event": ActionEvent["data"]
	"rdt:routes-tab-mounted": Record<string, never> // Request from client when routes tab is mounted
	"rdt:routes-info": Route[] // Response from server with routes info
	"rdt:request-all-route-info": Record<string, never> // Request from client to get all route info
	"rdt:all-route-info": Record<string, { loader: LoaderEvent[]; action: ActionEvent[] }> // Response from server with all route info
}

export const eventClient = new EventClient<EventMap>({
	pluginId: "rdt",
})
