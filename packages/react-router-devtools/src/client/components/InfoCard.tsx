import clsx from "clsx"
import type { ReactNode } from "react"

export const InfoCard = ({
	children,
	title,
	onClear,
}: {
	children: ReactNode
	title: string
	onClear?: () => void
}) => {
	return (
		<div className="mb-4 h-min rounded-lg border-solid border-gray-500/40 text-base font-normal text-white transition-all">
			<h3
				className={clsx(
					"flex min-h-[30px] items-center text-left text-sm",
					onClear ? "flex items-center justify-between gap-3" : ""
				)}
			>
				{title}
				{onClear && typeof import.meta.hot === "undefined" && (
					<button
						type="button"
						onClick={onClear}
						className="cursor-pointer rounded bg-red-500 px-2 py-1 text-sm font-semibold text-white"
					>
						Clear
					</button>
				)}
			</h3>

			{children}
		</div>
	)
}
