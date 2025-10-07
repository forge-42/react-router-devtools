import { AnimatePresence } from "framer-motion"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Tooltip } from "react-tooltip"
import type { RequestEvent } from "../../../shared/request-event"
import { METHOD_COLORS } from "../../tabs/TimelineTab"
import { Tag } from "../Tag"
import { NetworkBar } from "./NetworkBar"
import { REQUEST_BORDER_COLORS, RequestDetails } from "./RequestDetails"

interface Props {
	requests: RequestEvent[]
	width: number
}

const BAR_HEIGHT = 20
const BAR_PADDING = 8
const TIME_COLUMN_INTERVAL = 1000 // 1 second
const _MIN_SCALE = 0.1
const _MAX_SCALE = 10
const FUTURE_BUFFER = 1000 // 2 seconds ahead
const INACTIVE_THRESHOLD = 100 // 1 seconds

const TYPE_COLORS = {
	loader: "bg-green-500",
	"client-loader": "bg-blue-500",
	action: "bg-yellow-500",
	"client-action": "bg-purple-500",
	"custom-event": "bg-white",
}
const TYPE_TEXT_COLORS = {
	loader: "text-green-500",
	"client-loader": "text-blue-500",
	action: "text-yellow-500",
	"client-action": "text-purple-500",
	"custom-event": "text-white",
}

const NetworkWaterfall: React.FC<Props> = ({ requests, width }) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [scale, _setScale] = useState(0.1)
	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 })
	const [selectedRequestIndex, setSelectedRequest] = useState<number | null>(null)
	const [now, setNow] = useState(Date.now())
	const selectedRequest = selectedRequestIndex !== null ? requests[selectedRequestIndex] : null
	// Check if there are any active requests
	const hasActiveRequests = requests.some(
		(req) => !req.endTime || (req.endTime && now - req.endTime < INACTIVE_THRESHOLD)
	)
	useEffect(() => {
		if (!hasActiveRequests) {
			return
		}
		const interval = setInterval(() => setNow(Date.now()), 16)
		return () => clearInterval(interval)
	}, [hasActiveRequests])

	const minTime = Math.min(...requests.map((r) => r.startTime))
	const maxTime = hasActiveRequests
		? now + FUTURE_BUFFER
		: requests.length > 0
			? Math.max(...requests.map((r) => r.endTime || r.startTime)) + 1000
			: now
	const duration = maxTime - minTime
	const pixelsPerMs = scale
	const scaledWidth = Math.max(width, duration * pixelsPerMs)
	const timeColumns = Math.ceil(duration / TIME_COLUMN_INTERVAL)

	// Auto-scroll to keep the current time in view
	useEffect(() => {
		if (containerRef.current && !isDragging && hasActiveRequests) {
			const currentTimePosition = (now - minTime) * pixelsPerMs
			const containerWidth = containerRef.current.clientWidth
			const targetScroll = Math.max(0, currentTimePosition - containerWidth * 0.8)

			containerRef.current.scrollLeft = targetScroll
		}
	}, [now, minTime, pixelsPerMs, isDragging, hasActiveRequests])

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true)
		setDragStart({
			x: e.pageX - (containerRef.current?.offsetLeft || 0),
			scrollLeft: containerRef.current?.scrollLeft || 0,
		})
	}

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return
		e.preventDefault()
		const x = e.pageX - (containerRef.current?.offsetLeft || 0)
		const walk = (x - dragStart.x) * 2
		if (containerRef.current) {
			containerRef.current.scrollLeft = dragStart.scrollLeft - walk
		}
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	//	const handleWheel = (e: React.WheelEvent) => {
	//		const delta = -Math.sign(e.deltaY) * 0.1
	//		setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)))
	//	}

	const handleBarClick = (_e: React.MouseEvent, _request: RequestEvent, index: number) => {
		setSelectedRequest(index)
	}

	/* 	const handleReset = () => {
		setScale(0.1)
		if (containerRef.current) {
			containerRef.current.scrollLeft = 0
		}
	} */
	const onChangeRequest = (index: number) => {
		setSelectedRequest(index)
	}
	const onClose = () => {
		setSelectedRequest(null)
	}
	useHotkeys("arrowleft,arrowright", (e) => {
		const order = selectedRequestIndex
		if (order === null) {
			return onChangeRequest(0)
		}
		if (!selectedRequest) {
			return
		}

		if (e.key === "ArrowLeft" && order > 0) {
			onChangeRequest(order - 1)
		}
		if (e.key === "ArrowRight" && order < requests.length - 1) {
			onChangeRequest(order + 1)
		}
	})
	return (
		<div className="relative">
			<div className="flex">
				<div>
					<div className="h-5 flex items-center border-b border-gray-700 mb-1   pb-2">Requests</div>
					<div style={{ gap: BAR_PADDING }} className=" pr-4 flex flex-col z-50 ">
						{requests.map((request, index) => (
							<div
								style={{ height: BAR_HEIGHT }}
								key={request.id + request.startTime}
								className="flex gap-2 items-center"
							>
								<button
									type="button"
									className={`flex w-full items-center focus-visible:outline-none gap-2 px-2 py-0.5 text-md text-white border rounded ${index === selectedRequestIndex ? `${REQUEST_BORDER_COLORS[request.type]}` : "border-transparent"}`}
									onClick={(e) => handleBarClick(e, request, index)}
								>
									<div
										data-tooltip-id={`${request.id}${request.startTime}`}
										data-tooltip-html={`<div>This was triggered by ${request.type.startsWith("a") ? "an" : "a"} <span class="font-bold ${TYPE_TEXT_COLORS[request.type]}">${request.type}</span> request</div>`}
										data-tooltip-place="top"
										className={`size-2 p-1 ${TYPE_COLORS[request.type]}`}
									/>

									<Tooltip place="top" id={`${request.id}${request.startTime}`} />
									<div className="pr-4">
										<div className="whitespace-nowrap">{request.id}</div>
									</div>
								</button>
								<div className="flex items-center ml-auto">
									{request?.method && (
										<Tag className="!px-1 !py-0 text-[0.7rem]" color={METHOD_COLORS[request.method]}>
											{request.method}
										</Tag>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
				<div
					ref={containerRef}
					className="relative overflow-x-auto scrollbar-hide flex"
					style={{
						height: Math.min(requests.length * (BAR_HEIGHT + BAR_PADDING) + 24, window.innerHeight - 200),
						cursor: isDragging ? "grabbing" : "grab",
					}}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
				>
					<div className="relative" style={{ width: scaledWidth }}>
						<div className="absolute top-0 left-0 right-0 h-5 border-b border-gray-700">
							{Array.from({ length: timeColumns }).map((_, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={i}
									className="absolute top-0 h-full border-r-none border-t-none border-b-none !border-l border-white border-l-2 text-xs text-white "
									style={{
										left: i * TIME_COLUMN_INTERVAL * pixelsPerMs,
									}}
								>
									<span className="ml-1">{i}s</span>
									<div
										className="absolute -left-[1px] border-l  stroke-5 border-dashed border-gray-700 "
										style={{ height: BAR_HEIGHT * requests.length + 1 + (BAR_PADDING * requests.length + 1), width: 1 }}
									/>
								</div>
							))}
						</div>

						<AnimatePresence>
							{requests.map((request, index) => (
								<NetworkBar
									key={request.id + request.startTime}
									request={request}
									index={index}
									minTime={minTime}
									pixelsPerMs={pixelsPerMs}
									barHeight={BAR_HEIGHT}
									barPadding={BAR_PADDING}
									now={now}
									onClick={handleBarClick}
									isActive={hasActiveRequests}
								/>
							))}
						</AnimatePresence>
					</div>
				</div>
			</div>
			<div className="w-full">
				{selectedRequest && (
					<AnimatePresence>
						<RequestDetails
							total={requests.length}
							index={selectedRequestIndex}
							request={selectedRequest}
							onChangeRequest={onChangeRequest}
							onClose={onClose}
						/>
					</AnimatePresence>
				)}
			</div>
			{/* 		<div className="sticky top-0 z-10 bg-gray-900 p-2 border-b border-gray-700 flex items-center gap-2">
				<button
					type="button"
					className="p-1 hover:bg-gray-700 rounded"
					onClick={() => setScale((s) => Math.min(MAX_SCALE, s + 0.1))}
				>
					<div id="zoom-in" className="w-4 h-4" />
				</button>
				<button
					type="button"
					className="p-1 hover:bg-gray-700 rounded"
					onClick={() => setScale((s) => Math.max(MIN_SCALE, s - 0.1))}
				>
					<div id="zoom-out" className="w-4 h-4" />
				</button>
				<button type="button" className="p-1 hover:bg-gray-700 rounded" onClick={handleReset}>
					<div id="rotate-ccw" className="w-4 h-4" />
				</button>
				<div className="text-sm text-gray-400">Scale: {scale.toFixed(2)}x</div>
			</div> */}
		</div>
	)
}

export default NetworkWaterfall
