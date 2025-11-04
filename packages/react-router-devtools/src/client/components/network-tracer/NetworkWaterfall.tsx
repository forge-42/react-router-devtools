import { AnimatePresence } from "framer-motion"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Tooltip } from "react-tooltip"
import type { RequestEvent } from "../../../shared/request-event"
import { cx } from "../../styles/use-styles"
import { useStyles } from "../../styles/use-styles"
import { METHOD_COLORS } from "../../tabs/TimelineTab"
import { Tag } from "../Tag"
import { NetworkBar } from "./NetworkBar"
import { RequestDetails } from "./RequestDetails"

interface Props {
	requests: RequestEvent[]
	width: number
}

const BAR_HEIGHT = 16
const BAR_PADDING = 6
const TIME_COLUMN_INTERVAL = 1000 // 1 second
const _MIN_SCALE = 0.1
const _MAX_SCALE = 10
const FUTURE_BUFFER = 1000 // 2 seconds ahead
const INACTIVE_THRESHOLD = 100 // 1 seconds

const TYPE_TEXT_COLORS = {
	loader: "text-green-500",
	"client-loader": "text-blue-500",
	action: "text-yellow-500",
	"client-action": "text-purple-500",
	"custom-event": "text-white",
}

type EventType = "loader" | "client-loader" | "action" | "client-action" | "custom-event"

const EVENT_TYPE_FILTERS: { value: EventType | "all"; label: string; color: string }[] = [
	{ value: "all", label: "All Events", color: "#ffffff" },
	{ value: "loader", label: "Loader", color: "#4ade80" },
	{ value: "client-loader", label: "Client Loader", color: "#60a5fa" },
	{ value: "action", label: "Action", color: "#f59e0b" },
	{ value: "client-action", label: "Client Action", color: "#ef4444" },
	{ value: "custom-event", label: "Custom Event", color: "#ffffff" },
]

const NetworkWaterfall: React.FC<Props> = ({ requests, width }) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const { styles } = useStyles()
	const [scale, _setScale] = useState(0.1)
	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 })
	const [selectedRequestIndex, setSelectedRequest] = useState<number | null>(null)
	const [now, setNow] = useState(Date.now())
	const [activeTypeFilter, setActiveTypeFilter] = useState<EventType | "all">("all")
	const [activeRouteFilters, setActiveRouteFilters] = useState<Set<string>>(new Set())
	const selectedRequest = selectedRequestIndex !== null ? requests[selectedRequestIndex] : null

	// Get unique routes from all requests
	const uniqueRoutes = Array.from(new Set(requests.map((req) => req.routeId))).sort()

	// Filter requests based on active filters
	let filteredRequests = requests

	// Apply type filter
	if (activeTypeFilter !== "all") {
		filteredRequests = filteredRequests.filter((req) => req.type === activeTypeFilter)
	}

	// Apply route filters (if any selected)
	if (activeRouteFilters.size > 0) {
		filteredRequests = filteredRequests.filter((req) => activeRouteFilters.has(req.routeId))
	}

	// Check if there are any active requests
	const hasActiveRequests = filteredRequests.some(
		(req) => !req.endTime || (req.endTime && now - req.endTime < INACTIVE_THRESHOLD)
	)
	useEffect(() => {
		if (!hasActiveRequests) {
			return
		}
		const interval = setInterval(() => setNow(Date.now()), 16)
		return () => clearInterval(interval)
	}, [hasActiveRequests])

	const minTime = Math.min(...filteredRequests.map((r) => r.startTime))
	const maxTime = hasActiveRequests
		? now + FUTURE_BUFFER
		: filteredRequests.length > 0
			? Math.max(...filteredRequests.map((r) => r.endTime || r.startTime)) + 1000
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
		if (e.key === "ArrowRight" && order < filteredRequests.length - 1) {
			onChangeRequest(order + 1)
		}
	})

	const toggleRouteFilter = (route: string) => {
		setActiveRouteFilters((prev) => {
			const newFilters = new Set(prev)
			if (newFilters.has(route)) {
				newFilters.delete(route)
			} else {
				newFilters.add(route)
			}
			return newFilters
		})
	}

	const clearRouteFilters = () => {
		setActiveRouteFilters(new Set())
	}

	return (
		<div className={styles.network.waterfall.container}>
			{/* Type Filter Bar */}
			<div className={styles.network.waterfall.filterBar}>
				<div className={styles.network.waterfall.filterLabel}>Type:</div>
				<div className={styles.network.waterfall.filterButtons}>
					{EVENT_TYPE_FILTERS.map((filter) => (
						<button
							key={filter.value}
							type="button"
							className={cx(
								styles.network.waterfall.filterButton,
								activeTypeFilter === filter.value && styles.network.waterfall.filterButtonActive
							)}
							style={{
								borderColor: activeTypeFilter === filter.value ? filter.color : "transparent",
								color: activeTypeFilter === filter.value ? filter.color : "#9ca3af",
							}}
							onClick={() => setActiveTypeFilter(filter.value)}
						>
							{filter.label}
							{filter.value !== "all" && (
								<span className={styles.network.waterfall.filterCount}>
									({requests.filter((r) => r.type === filter.value).length})
								</span>
							)}
							{filter.value === "all" && (
								<span className={styles.network.waterfall.filterCount}>({requests.length})</span>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Route Filter Bar */}
			<div className={styles.network.waterfall.filterBar}>
				<div className={styles.network.waterfall.filterLabel}>
					Routes:
					{activeRouteFilters.size > 0 && (
						<span className={styles.network.waterfall.filterCount} style={{ marginLeft: "0.25rem" }}>
							({activeRouteFilters.size} selected)
						</span>
					)}
				</div>
				<div className={styles.network.waterfall.filterButtons}>
					<button
						type="button"
						className={cx(
							styles.network.waterfall.filterButton,
							activeRouteFilters.size === 0 && styles.network.waterfall.filterButtonActive
						)}
						style={{
							borderColor: activeRouteFilters.size === 0 ? "#ffffff" : "transparent",
							color: activeRouteFilters.size === 0 ? "#ffffff" : "#9ca3af",
						}}
						onClick={clearRouteFilters}
					>
						All Routes
						<span className={styles.network.waterfall.filterCount}>({uniqueRoutes.length})</span>
					</button>
					{uniqueRoutes.map((route) => {
						const isActive = activeRouteFilters.has(route)
						const routeCount = requests.filter((r) => r.routeId === route).length
						return (
							<button
								key={route}
								type="button"
								className={cx(
									styles.network.waterfall.filterButton,
									isActive && styles.network.waterfall.filterButtonActive
								)}
								style={{
									borderColor: isActive ? "#60a5fa" : "transparent",
									color: isActive ? "#60a5fa" : "#9ca3af",
								}}
								onClick={() => toggleRouteFilter(route)}
							>
								{route}
								<span className={styles.network.waterfall.filterCount}>({routeCount})</span>
							</button>
						)
					})}
				</div>
			</div>

			{/* Results summary */}
			{(activeTypeFilter !== "all" || activeRouteFilters.size > 0) && (
				<div className={styles.network.waterfall.filterSummary}>
					Showing {filteredRequests.length} of {requests.length} events
					{activeRouteFilters.size > 0 && (
						<button type="button" className={styles.network.waterfall.clearFiltersButton} onClick={clearRouteFilters}>
							Clear route filters
						</button>
					)}
				</div>
			)}

			<div className={styles.network.waterfall.flexContainer}>
				<div>
					<div className={styles.network.waterfall.requestsHeader}>Requests</div>
					<div style={{ gap: BAR_PADDING }} className={styles.network.waterfall.requestsList}>
						{filteredRequests.map((request, index) => {
							const borderColorClass =
								request.type === "loader"
									? styles.network.waterfall.requestButtonGreen
									: request.type === "client-loader"
										? styles.network.waterfall.requestButtonBlue
										: request.type === "action"
											? styles.network.waterfall.requestButtonYellow
											: request.type === "client-action"
												? styles.network.waterfall.requestButtonPurple
												: styles.network.waterfall.requestButtonWhite

							const indicatorColorClass =
								request.type === "loader"
									? styles.network.waterfall.requestIndicatorGreen
									: request.type === "client-loader"
										? styles.network.waterfall.requestIndicatorBlue
										: request.type === "action"
											? styles.network.waterfall.requestIndicatorYellow
											: request.type === "client-action"
												? styles.network.waterfall.requestIndicatorPurple
												: styles.network.waterfall.requestIndicatorWhite

							return (
								<div
									style={{ height: BAR_HEIGHT }}
									key={request.id + request.startTime}
									className={styles.network.waterfall.requestRow}
								>
									<button
										type="button"
										className={cx(
											styles.network.waterfall.requestButton,
											index === selectedRequestIndex && borderColorClass
										)}
										onClick={(e) => handleBarClick(e, request, index)}
									>
										<div
											data-tooltip-id={`${request.id}${request.startTime}`}
											data-tooltip-html={`<div>This was triggered by ${request.type.startsWith("a") ? "an" : "a"} <span class="font-bold ${TYPE_TEXT_COLORS[request.type]}">${request.type}</span> request</div>`}
											data-tooltip-place="top"
											className={cx(styles.network.waterfall.requestIndicator, indicatorColorClass)}
										/>

										<Tooltip place="top" id={`${request.id}${request.startTime}`} />
										<div className={styles.network.waterfall.requestId}>
											<div className={styles.network.waterfall.requestIdText}>{request.id}</div>
										</div>
									</button>
									<div className={styles.network.waterfall.methodTag}>
										{request?.method && (
											<Tag className="!px-1 !py-0 text-[0.7rem]" color={METHOD_COLORS[request.method]}>
												{request.method}
											</Tag>
										)}
									</div>
								</div>
							)
						})}
					</div>
				</div>
				<div
					ref={containerRef}
					className={cx(
						styles.network.waterfall.scrollContainer,
						isDragging ? styles.network.waterfall.scrollContainerGrabbing : styles.network.waterfall.scrollContainerGrab
					)}
					style={{
						height: Math.min(filteredRequests.length * (BAR_HEIGHT + BAR_PADDING) + 24, window.innerHeight - 200),
					}}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
				>
					<div className={styles.network.waterfall.chartContainer} style={{ width: scaledWidth }}>
						<div className={styles.network.waterfall.timelineHeader}>
							{Array.from({ length: timeColumns }).map((_, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={i}
									className={styles.network.waterfall.timeColumn}
									style={{
										left: i * TIME_COLUMN_INTERVAL * pixelsPerMs,
									}}
								>
									<span className={styles.network.waterfall.timeLabel}>{i}s</span>
									<div
										className={styles.network.waterfall.timeDivider}
										style={{
											height: BAR_HEIGHT * filteredRequests.length + 1 + (BAR_PADDING * filteredRequests.length + 1),
										}}
									/>
								</div>
							))}
						</div>

						<AnimatePresence mode="popLayout">
							{filteredRequests.map((request, index) => (
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
			{selectedRequest && (
				<AnimatePresence mode="wait">
					<RequestDetails
						key={selectedRequest.id + selectedRequest.startTime}
						total={filteredRequests.length}
						index={selectedRequestIndex}
						request={selectedRequest}
						onChangeRequest={onChangeRequest}
						onClose={onClose}
					/>
				</AnimatePresence>
			)}
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
