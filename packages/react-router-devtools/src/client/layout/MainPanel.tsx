import clsx from "clsx"

interface MainPanelProps {
	children: React.ReactNode
	isOpen: boolean
	isEmbedded?: boolean
	className?: string
}

const MainPanel = ({ children, isOpen, className }: MainPanelProps) => {
	return (
		<div
			data-testid="react-router-devtools-main-panel"
			style={{
				zIndex: 9998,
			}}
			className={clsx(
				"duration-600 w-full h-full flex-row box-border flex overflow-auto bg-main text-white opacity-0 transition-all",
				isOpen ? "opacity-100 drop-shadow-2xl" : "!h-0",

				className
			)}
		>
			{children}
		</div>
	)
}

export { MainPanel }
