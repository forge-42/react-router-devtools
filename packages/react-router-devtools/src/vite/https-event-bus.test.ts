import type { ViteDevServer } from "vite"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createViteIntegratedEventBus } from "./https-event-bus"

type EventHandler = (...args: unknown[]) => void

// Mock the ws module
vi.mock("ws", () => {
	const mockWebSocket = {
		OPEN: 1,
		CLOSED: 3,
	}

	class MockWebSocketServer {
		private handlers: Map<string, EventHandler[]> = new Map()

		on(event: string, handler: EventHandler) {
			if (!this.handlers.has(event)) {
				this.handlers.set(event, [])
			}
			this.handlers.get(event)?.push(handler)
		}

		emit(event: string, ...args: unknown[]) {
			const handlers = this.handlers.get(event) || []
			for (const handler of handlers) {
				handler(...args)
			}
		}

		handleUpgrade(_req: unknown, _socket: unknown, _head: unknown, callback: (ws: MockWebSocket) => void) {
			const ws = new MockWebSocket()
			callback(ws)
		}

		close() {
			this.handlers.clear()
		}
	}

	class MockWebSocket {
		readyState = 1 // OPEN
		private handlers: Map<string, EventHandler[]> = new Map()

		on(event: string, handler: EventHandler) {
			if (!this.handlers.has(event)) {
				this.handlers.set(event, [])
			}
			this.handlers.get(event)?.push(handler)
		}

		send(_data: string) {
			// Mock send
		}

		// Helper to simulate events
		simulateMessage(data: unknown) {
			const handlers = this.handlers.get("message") || []
			for (const handler of handlers) {
				handler(Buffer.from(JSON.stringify(data)))
			}
		}

		simulateClose() {
			const handlers = this.handlers.get("close") || []
			for (const handler of handlers) {
				handler()
			}
		}
	}

	return {
		WebSocket: mockWebSocket,
		WebSocketServer: MockWebSocketServer,
	}
})

describe("https-event-bus", () => {
	let mockServer: ViteDevServer
	let upgradeHandler: ((req: unknown, socket: unknown, head: unknown) => void) | null

	beforeEach(() => {
		upgradeHandler = null

		// Create a mock Vite server
		mockServer = {
			httpServer: {
				on: vi.fn((event: string, handler: EventHandler) => {
					if (event === "upgrade") {
						upgradeHandler = handler as typeof upgradeHandler
					}
				}),
			},
		} as unknown as ViteDevServer

		// Reset global event target
		globalThis.__TANSTACK_EVENT_TARGET__ = null
	})

	afterEach(() => {
		globalThis.__TANSTACK_EVENT_TARGET__ = null
	})

	describe("createViteIntegratedEventBus", () => {
		it("should create an event bus with emitToClients and close methods", () => {
			const eventBus = createViteIntegratedEventBus(mockServer)

			expect(eventBus).toHaveProperty("emitToClients")
			expect(eventBus).toHaveProperty("close")
			expect(typeof eventBus.emitToClients).toBe("function")
			expect(typeof eventBus.close).toBe("function")

			eventBus.close()
		})

		it("should register upgrade handler on httpServer", () => {
			const eventBus = createViteIntegratedEventBus(mockServer)

			expect(mockServer.httpServer?.on).toHaveBeenCalledWith("upgrade", expect.any(Function))

			eventBus.close()
		})

		it("should create global event target if not exists", () => {
			expect(globalThis.__TANSTACK_EVENT_TARGET__).toBeNull()

			const eventBus = createViteIntegratedEventBus(mockServer)

			expect(globalThis.__TANSTACK_EVENT_TARGET__).toBeInstanceOf(EventTarget)

			eventBus.close()
		})

		it("should reuse existing global event target", () => {
			const existingTarget = new EventTarget()
			globalThis.__TANSTACK_EVENT_TARGET__ = existingTarget

			const eventBus = createViteIntegratedEventBus(mockServer)

			expect(globalThis.__TANSTACK_EVENT_TARGET__).toBe(existingTarget)

			eventBus.close()
		})

		it("should handle upgrade requests for /__devtools/ws path", () => {
			const eventBus = createViteIntegratedEventBus(mockServer)

			expect(upgradeHandler).not.toBeNull()

			// Simulate an upgrade request
			const mockReq = { url: "/__devtools/ws" }
			const mockSocket = {}
			const mockHead = Buffer.alloc(0)

			// This should not throw
			upgradeHandler?.(mockReq, mockSocket, mockHead)

			eventBus.close()
		})

		it("should not handle upgrade requests for other paths", () => {
			const eventBus = createViteIntegratedEventBus(mockServer)

			expect(upgradeHandler).not.toBeNull()

			// Simulate an upgrade request for a different path
			const mockReq = { url: "/some-other-path" }
			const mockSocket = {}
			const mockHead = Buffer.alloc(0)

			// This should not throw and should not process the upgrade
			upgradeHandler?.(mockReq, mockSocket, mockHead)

			eventBus.close()
		})

		it("should clean up on close", () => {
			const eventBus = createViteIntegratedEventBus(mockServer)

			// Close should not throw
			expect(() => eventBus.close()).not.toThrow()
		})

		it("should handle server without httpServer", () => {
			const serverWithoutHttp = {} as ViteDevServer

			// Should not throw when httpServer is undefined
			const eventBus = createViteIntegratedEventBus(serverWithoutHttp)

			expect(eventBus).toHaveProperty("emitToClients")
			expect(eventBus).toHaveProperty("close")

			eventBus.close()
		})
	})

	describe("event dispatching", () => {
		it("should dispatch events to global event target", () => {
			const eventBus = createViteIntegratedEventBus(mockServer)
			const eventTarget = globalThis.__TANSTACK_EVENT_TARGET__

			expect(eventTarget).not.toBeNull()

			const mockHandler = vi.fn()
			eventTarget?.addEventListener("tanstack-dispatch-event", mockHandler)

			// Dispatch an event
			const testEvent = new CustomEvent("tanstack-dispatch-event", {
				detail: { type: "test", data: "hello" },
			})
			eventTarget?.dispatchEvent(testEvent)

			expect(mockHandler).toHaveBeenCalled()

			eventBus.close()
		})
	})
})
