import { useEffect, useRef } from "react"

type ListenerAttachmentTarget = "window" | "document" | "body"

const getAttachment = (target: ListenerAttachmentTarget) => {
	switch (target) {
		case "window":
			return typeof window !== "undefined" ? window : null
		case "document":
			return typeof document !== "undefined" ? document : null
		case "body":
			return typeof document !== "undefined" ? document.body : null
	}
}

/**
 * Helper hook that listens to the document scroll event and triggers a callback function
 * @param fn Function to be called when the event happens
 */
export const useAttachListener = (
	listener: keyof HTMLElementEventMap | keyof WindowEventMap | keyof DocumentEventMap,
	attachTarget: ListenerAttachmentTarget,
	fn: EventListener,
	shouldAttach = true
) => useAttachListenerToNode(listener, getAttachment(attachTarget), fn, shouldAttach)

/**
 * Helper hook that listens to the provided event on the provided node and triggers a callback function
 * @param fn Function to be called when the event happens
 */
const useAttachListenerToNode = (
	listener: keyof HTMLElementEventMap | keyof WindowEventMap | keyof DocumentEventMap,
	node: HTMLElement | Window | Document | null,
	fn: EventListener,
	shouldAttach = true
) => {
	const callbackRef = useRef(fn)
	// Makes sure the latest function callback is used so it doesn't use stale values and props
	useEffect(() => {
		callbackRef.current = fn
	})
	// Attaches the event listener to the node
	useEffect(() => {
		if (!shouldAttach) return
		node?.addEventListener(listener, (e) => callbackRef.current(e))
		return () => node?.removeEventListener(listener, (e) => callbackRef.current(e))
	}, [listener, node, shouldAttach])
}

/**
 * Helper hook that listens to the document scroll event and triggers a callback function
 * @param fn Function to be called when the user scrolls
 */
export const useAttachWindowListener = (
	listener: keyof WindowEventMap,
	fn: (...args: unknown[]) => unknown,
	shouldAttach = true
) => {
	return useAttachListener(listener, "window", fn, shouldAttach)
}

/**
 * Helper hook that listens to the document scroll event and triggers a callback function
 * @param fn Function to be called when the user scrolls
 */
export const useAttachDocumentListener = (
	listener: keyof WindowEventMap,
	fn: (...args: unknown[]) => unknown,
	shouldAttach = true
) => {
	return useAttachListener(listener, "document", fn, shouldAttach)
}

/**
 * Helper hook that listens to the document scroll event and triggers a callback function
 * @param fn Function to be called when the user scrolls
 */
// const useAttachBodyListener = (
// listener: keyof WindowEventMap,
// fn: (...args: unknown[]) => unknown,
// shouldAttach = true
//) => {
// return useAttachListener(listener, "body", fn, shouldAttach);
//};
