import type { ViteDevServer } from "vite"
import { WebSocket, WebSocketServer } from "ws"

/**
 * Creates a WebSocket server that uses Vite's existing HTTP(S) server.
 * This ensures the devtools WebSocket works correctly when Vite is configured with HTTPS.
 */
export function createViteIntegratedEventBus(server: ViteDevServer) {
	const clients = new Set<WebSocket>()
	const eventTarget = globalThis.__TANSTACK_EVENT_TARGET__ ?? new EventTarget()

	if (!globalThis.__TANSTACK_EVENT_TARGET__) {
		globalThis.__TANSTACK_EVENT_TARGET__ = eventTarget
	}

	// Create WebSocket server without its own HTTP server
	const wss = new WebSocketServer({ noServer: true })

	// Handle WebSocket connections
	wss.on("connection", (ws) => {
		clients.add(ws)

		ws.on("close", () => {
			clients.delete(ws)
		})

		ws.on("message", (msg) => {
			try {
				const data = JSON.parse(msg.toString())
				// Emit to server-side listeners
				eventTarget.dispatchEvent(new CustomEvent(data.type, { detail: data }))
				eventTarget.dispatchEvent(new CustomEvent("tanstack-devtools-global", { detail: data }))
			} catch {
				// Ignore parse errors
			}
		})
	})

	// Handle upgrade requests on Vite's HTTP server
	server.httpServer?.on("upgrade", (req, socket, head) => {
		if (req.url === "/__devtools/ws") {
			wss.handleUpgrade(req, socket, head, (ws) => {
				wss.emit("connection", ws, req)
			})
		}
	})

	// Function to emit events to all connected clients
	const emitToClients = (event: unknown) => {
		const json = JSON.stringify(event)
		for (const client of clients) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(json)
			}
		}
	}

	// Listen for server-side events and forward to clients
	const dispatcher = (e: Event) => {
		const event = (e as CustomEvent).detail
		emitToClients(event)
	}

	eventTarget.addEventListener("tanstack-dispatch-event", dispatcher)

	return {
		emitToClients,
		close: () => {
			eventTarget.removeEventListener("tanstack-dispatch-event", dispatcher)
			wss.close()
			clients.clear()
		},
	}
}

// Declare global types for the event target
declare global {
	var __TANSTACK_EVENT_TARGET__: EventTarget | null
}
