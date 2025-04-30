import { animate, motion, useMotionValue } from "framer-motion"
import type React from "react"
import { useEffect } from "react"
import type { RequestEvent } from "../../../shared/request-event"

interface NetworkBarProps {
	request: RequestEvent
	index: number
	minTime: number
	pixelsPerMs: number
	barHeight: number
	barPadding: number
	now: number
	onClick: (e: React.MouseEvent, request: RequestEvent, order: number) => void
	isActive: boolean
}

const COLORS = {
	loader: "#4ade80",
	"client-loader": "#60a5fa",
	action: "#f59e0b",
	"client-action": "#ef4444",
	"custom-event": "#ffffff",
	pending: "#94a3b8",
	error: "#dc2626",
}

export const NetworkBar: React.FC<NetworkBarProps> = ({
	request,
	index,
	minTime,
	pixelsPerMs,
	barHeight,
	barPadding,
	now,
	onClick,
	isActive,
}) => {
	const startX = (request.startTime - minTime) * pixelsPerMs
	const currentEndTime = request.endTime || now
	const duration = currentEndTime - request.startTime
	const y = index * (barHeight + barPadding) + 24
	const state = request.endTime ? "finished" : "pending"

	const color =
		state === "pending" ? COLORS.pending : COLORS[request.aborted ? "error" : (request.type as keyof typeof COLORS)]

	const barWidth = useMotionValue(2)

	useEffect(() => {
		const updateWidth = () => {
			if (request.endTime) {
				animate(barWidth, Math.max(2, (request.endTime - request.startTime) * pixelsPerMs), {
					duration: 0.3,
					ease: "easeOut",
				})
			} else if (isActive) {
				barWidth.set(Math.max(2, (now - request.startTime) * pixelsPerMs))
				requestAnimationFrame(updateWidth)
			}
		}

		if (isActive) {
			requestAnimationFrame(updateWidth)
		}

		if (!isActive) {
			barWidth.stop()
		}

		return () => {
			barWidth.stop()
		}
	}, [request.endTime, request.startTime, pixelsPerMs, now, barWidth, isActive])

	return (
		<motion.div
			style={{
				position: "absolute",
				top: y,
				height: barHeight,
				backgroundColor: color,
				borderRadius: "2px",
				width: barWidth,
				minWidth: "2px",
				x: startX,
			}}
			transition={{
				x: { duration: 0.3, ease: "easeOut" },
			}}
			className="relative overflow-hidden group cursor-pointer hover:brightness-110"
			onClick={(e) => onClick(e, request, index)}
		>
			{isActive && (
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
					animate={{ x: ["-100%", "100%"] }}
					transition={{
						repeat: Number.POSITIVE_INFINITY,
						duration: 1.5,
						ease: "linear",
					}}
				/>
			)}

			<div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none z-10">
				{request.method} {request.url}
				<br />
				{request.endTime ? `Duration: ${duration.toFixed(0)}ms` : `Elapsed: ${duration.toFixed(0)}ms...`}
			</div>
		</motion.div>
	)
}
