import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react"
import { eventClient } from "../../../shared/event-client"
import type { RequestEvent } from "../../../shared/request-event"

const RequestContext = createContext<{
	requests: RequestEvent[]
	removeAllRequests: () => void
}>({ requests: [], removeAllRequests: () => {} })

const requestMap = new Map<string, RequestEvent>()

export const RequestProvider = ({ children }: { children: ReactNode }) => {
	const [requests, setRequests] = useState<RequestEvent[]>([])

	const handleRequestEvent = useCallback((event: { payload: RequestEvent }) => {
		const req = event.payload
		requestMap.set(req.id + req.startTime, req)

		setRequests(Array.from(requestMap.values()))
	}, [])

	useEffect(() => {
		const unsubscribeRequestEvent = eventClient.on("request-event", handleRequestEvent)

		return () => {
			unsubscribeRequestEvent()
		}
	}, [handleRequestEvent])

	const removeAllRequests = useCallback(() => {
		setRequests([])
		requestMap.clear()
	}, [])
	return <RequestContext.Provider value={{ requests, removeAllRequests }}>{children}</RequestContext.Provider>
}

export const useRequestContext = () => {
	return useContext(RequestContext)
}
