import { motion } from "framer-motion"
import { type ReactNode, useEffect, useRef, useState } from "react"
import { cn } from "~/utils/css"

export const MaskContainer = ({
	children,
	revealText,
	size = 10,
	revealSize = 600,
	className,
}: {
	children?: string | ReactNode
	revealText?: string | ReactNode
	size?: number
	revealSize?: number
	className?: string
}) => {
	const [isHovered, setIsHovered] = useState(false)
	const [mousePosition, setMousePosition] = useState<any>({ x: null, y: null })
	const containerRef = useRef<any>(null)
	const updateMousePosition = (e: any) => {
		const rect = containerRef.current.getBoundingClientRect()
		setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
	}

	useEffect(() => {
		containerRef.current.addEventListener("mousemove", updateMousePosition)
		return () => {
			if (containerRef.current) {
				containerRef.current.removeEventListener("mousemove", updateMousePosition)
			}
		}
	}, [])
	const maskSize = isHovered ? revealSize : size

	return (
		<motion.div
			ref={containerRef}
			className={cn("relative h-screen w-full", className)}
			animate={{
				backgroundColor: isHovered ? "var(--slate-950)" : "var(--slate-950)",
			}}
		>
			<motion.div
				className="bg-grid-white/[0.2] absolute flex h-full w-full items-center justify-center bg-black text-6xl text-white [mask-image:url(/mask.svg)] [mask-repeat:no-repeat] [mask-size:40px]"
				animate={{
					maskPosition: `${mousePosition.x - maskSize / 2}px ${mousePosition.y - maskSize / 2}px`,
					maskSize: `${maskSize}px`,
				}}
				transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
			>
				<div className="absolute inset-0 z-0 h-full w-full bg-black opacity-50" />
				<div
					onMouseEnter={() => {
						setIsHovered(true)
					}}
					onMouseLeave={() => {
						setIsHovered(false)
					}}
					className="relative z-20 mx-auto max-w-4xl  text-center text-4xl font-bold text-white"
				>
					{children}
				</div>
			</motion.div>

			<div className="flex h-full w-full items-center justify-center  text-white">{revealText}</div>
		</motion.div>
	)
}
