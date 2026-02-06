import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react"
import { eventClient } from "../../../shared/event-client"
import type { RequestEvent } from "../../../shared/request-event"

const RequestContext = createContext<{
	requests: RequestEvent[]
	removeAllRequests: () => void
	isLimitReached: boolean
}>({ requests: [], removeAllRequests: () => {}, isLimitReached: false })

const requestMap = new Map<string, RequestEvent>()
const MAX_REQUESTS = 60

export const RequestProvider = ({ children }: { children: ReactNode }) => {
	const [requests, setRequests] = useState<RequestEvent[]>([])
	const [isLimitReached, setIsLimitReached] = useState(false)

	const handleRequestEvent = useCallback((event: { payload: RequestEvent }) => {
		const req = event.payload
		requestMap.set(req.id + req.startTime, req)

		// Get all requests and sort by start time (oldest first)
		const allRequests = Array.from(requestMap.values()).sort((a, b) => a.startTime - b.startTime)

		// If we exceed MAX_REQUESTS, remove the oldest ones
		if (allRequests.length > MAX_REQUESTS) {
			const requestsToRemove = allRequests.slice(0, allRequests.length - MAX_REQUESTS)
			for (const oldRequest of requestsToRemove) {
				requestMap.delete(oldRequest.id + oldRequest.startTime)
			}
			setIsLimitReached(true)
		}

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
		setIsLimitReached(false)
		requestMap.clear()
	}, [])
	return (
		<RequestContext.Provider value={{ requests, removeAllRequests, isLimitReached }}>
			{children}
		</RequestContext.Provider>
	)
}

export const useRequestContext = () => {
	return useContext(RequestContext)
}
