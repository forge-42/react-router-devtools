import clsx from "clsx"
import { useMatches, useRevalidator } from "react-router"

import { RouteSegmentInfo } from "../components/RouteSegmentInfo.js"

const PageTab = () => {
	const routes = useMatches()
	const { revalidate, state } = useRevalidator()

	return (
		<>
			<div className="sticky w-full top-0 z-30 mb-2 bg-[#212121] pt-2">
				<div className="mb-1 flex justify-between ">
					<div className="text-lg font-semibold">Active Route Segments</div>
					<button
						type="button"
						onClick={() => revalidate()}
						data-testid="revalidate-button"
						className={clsx(
							"z-20 cursor-pointer rounded-lg border border-green-500 px-3 py-1 text-sm font-semibold text-white",
							state !== "idle" && "pointer-events-none opacity-50"
						)}
					>
						{state !== "idle" ? "Revalidating..." : "Revalidate"}
					</button>
				</div>
				<hr className="border-gray-700" />
			</div>
			<div className="relative flex h-full flex-col p-6 px-2 pl-4 lg:px-6">
				<ol
					className={clsx("relative border-l border-gray-700", state === "loading" && "pointer-events-none opacity-50")}
				>
					{routes.map((route, i) => (
						<RouteSegmentInfo route={route} i={i} key={route.id} />
					))}
				</ol>
			</div>
		</>
	)
}

export { PageTab }
