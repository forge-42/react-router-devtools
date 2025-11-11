import { motion, useMotionValue } from "framer-motion"
import type React from "react"
import { useEffect } from "react"
import type { RequestEvent } from "../../../shared/request-event"
import { cx } from "../../styles/use-styles"
import { useStyles } from "../../styles/use-styles"

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
	action: "#FFD700",
	"client-action": "#ef4444",
	middleware: "#FFA500",
	"client-middleware": "#FF69B4",
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
	const { styles } = useStyles()
	const startX = (request.startTime - minTime) * pixelsPerMs
	const y = index * (barHeight + barPadding) + 24
	const state = request.endTime ? "finished" : "pending"

	const color =
		state === "pending" ? COLORS.pending : COLORS[request.aborted ? "error" : (request.type as keyof typeof COLORS)]

	// For finished requests, use the final width directly without animation
	const finalWidth = request.endTime
		? Math.max(2, (request.endTime - request.startTime) * pixelsPerMs)
		: Math.max(2, (now - request.startTime) * pixelsPerMs)

	const barWidth = useMotionValue(finalWidth)

	useEffect(() => {
		// Only animate if the request is not finished
		if (!request.endTime && isActive) {
			let animationFrameId: number

			const updateWidth = () => {
				const currentWidth = Math.max(2, (Date.now() - request.startTime) * pixelsPerMs)
				barWidth.set(currentWidth)
				animationFrameId = requestAnimationFrame(updateWidth)
			}

			animationFrameId = requestAnimationFrame(updateWidth)

			return () => {
				cancelAnimationFrame(animationFrameId)
				barWidth.stop()
			}
		}

		// For finished requests, set the width once and never change it
		if (request.endTime) {
			barWidth.set(finalWidth)
		}
	}, [request.endTime, request.startTime, pixelsPerMs, barWidth, isActive, finalWidth])

	const currentEndTime = request.endTime || now
	const duration = currentEndTime - request.startTime

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			style={{
				position: "absolute",
				top: y,
				height: barHeight,
				backgroundColor: color,
				borderRadius: "3px",
				width: barWidth,
				minWidth: "2px",
				x: startX,
				boxShadow: request.endTime ? "0 1px 3px rgba(0, 0, 0, 0.3)" : "0 1px 3px rgba(0, 0, 0, 0.2)",
			}}
			transition={{
				layout: { duration: 0.2, ease: "easeOut" },
				opacity: { duration: 0.2 },
				scale: { duration: 0.2 },
				x: { duration: 0.25, ease: "easeOut" },
				backgroundColor: { duration: 0.15, ease: "easeOut" },
			}}
			className={styles.network.bar.container}
			onClick={(e) => onClick(e, request, index)}
		>
			{!request.endTime && (
				<motion.div
					className={styles.network.bar.shimmer}
					animate={{ x: ["-100%", "100%"] }}
					transition={{
						repeat: Number.POSITIVE_INFINITY,
						duration: 1.2,
						ease: "linear",
					}}
				/>
			)}

			<div className={cx(styles.network.bar.tooltip, "network-bar-tooltip")}>
				<strong>{request.id}</strong> - {request.method} {request.url}
				<br />
				{request.endTime ? `Duration: ${duration.toFixed(0)}ms` : `Elapsed: ${duration.toFixed(0)}ms...`}
			</div>
		</motion.div>
	)
}
