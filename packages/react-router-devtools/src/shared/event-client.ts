import { EventClient } from "@tanstack/devtools-event-client"
import type { ActionEvent, LoaderEvent } from "../server/event-queue.js"
import type { RequestEvent } from "./request-event"

interface EventMap {
	"rdt:request-event": RequestEvent
	"rdt:get-events": RequestEvent[] // Both request (empty array) and response (array of events)
	"rdt:remove-event": { id: string; startTime: number; fromClient?: boolean }
	"rdt:loader-event": LoaderEvent["data"]
	"rdt:action-event": ActionEvent["data"]
}

export const eventClient = new EventClient<EventMap>({
	pluginId: "rdt",
})
