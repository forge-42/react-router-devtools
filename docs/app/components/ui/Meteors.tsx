import { cn } from "~/utils/css"

export const Meteors = ({
	number,
	className,
}: {
	number?: number
	className?: string
}) => {
	const meteors = new Array(number || 20).fill(true)

	return meteors.map((el, idx) => (
		<span
			key={"meteor" + idx}
			className={cn(
				"absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215] animate-meteor-effect rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
				"before:absolute before:top-1/2 before:h-px before:w-12 before:-translate-y-1/2 before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
				className
			)}
			style={{
				top: 0,
				left: Math.floor(Math.random() * (1920 - -1920) + -1920) + "px",
				animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
				animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
			}}
		></span>
	))
}
