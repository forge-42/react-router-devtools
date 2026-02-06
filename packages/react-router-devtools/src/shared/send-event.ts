import { eventClient } from "./event-client"
import type { RequestEvent } from "./request-event"

export const sendEvent = (event: RequestEvent) => {
	eventClient.emit("request-event", event)
}
