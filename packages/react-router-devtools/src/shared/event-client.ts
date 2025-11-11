import { EventClient } from "@tanstack/devtools-event-client"
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
	"rdt:routes-tab-mounted": Record<string, never> // Request from client when routes tab is mounted
	"rdt:routes-info": Route[] // Response from server with routes info
}

export const eventClient = new EventClient<EventMap>({
	pluginId: "rdt",
})
