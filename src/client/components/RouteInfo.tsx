import clsx from "clsx"
import type { MouseEvent } from "react"
import { Link } from "react-router"
import { useSettingsContext } from "../context/useRDTContext.js"
import { type ExtendedRoute, constructRoutePath } from "../utils/routing.js"
import { findParentErrorBoundary } from "../utils/sanitize.js"
import { Input } from "./Input.js"
import { Tag } from "./Tag.js"
import { Icon } from "./icon/Icon.js"

interface RouteInfoProps {
	route: ExtendedRoute
	className?: string
	openNewRoute: (path: string) => (e?: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
	onClose?: () => void
}

export const RouteInfo = ({ route: routeToUse, className, openNewRoute, onClose }: RouteInfoProps) => {
	const route = window.__reactRouterManifest?.routes[routeToUse.id] || routeToUse
	const { settings, setSettings } = useSettingsContext()
	const { routeWildcards, routeViewMode } = settings
	const { hasWildcard, path, pathToOpen } = constructRoutePath(routeToUse, routeWildcards)
	const isTreeView = routeViewMode === "tree"
	const { hasErrorBoundary, errorBoundaryId } = findParentErrorBoundary(route)
	const hasParentErrorBoundary = errorBoundaryId && errorBoundaryId !== route.id

	return (
		<div className={clsx(className, "relative")}>
			{isTreeView && (
				<>
					<Icon onClick={onClose} className="absolute right-2 top-2 cursor-pointer text-red-600" name="X" />

					<h1 className="text-xl font-semibold">{routeToUse.url}</h1>
					<hr className="mb-4 mt-1" />
					<h3>
						<span className="text-gray-500">Path:</span> {path}
					</h3>
					<h3>
						<span className="text-gray-500">Url:</span> {pathToOpen}
					</h3>
				</>
			)}
			<div className="flex gap-2">
				<span className="whitespace-nowrap text-gray-500">Route file:</span>
				{route.module ?? routeToUse.file}
			</div>

			<div className="mb-4 mt-4 flex flex-col gap-2">
				<span className="text-gray-500">Components contained in the route:</span>
				<div className="flex flex-wrap gap-2">
					<Tag className="h-max" color={route.hasLoader ? "GREEN" : "RED"}>
						Loader
					</Tag>
					<Tag className="h-max" color={route.hasClientLoader ? "GREEN" : "RED"}>
						Client Loader
					</Tag>
					<Tag className="h-max" color={route.hasClientAction ? "GREEN" : "RED"}>
						Client Action
					</Tag>
					<Tag className="h-max" color={route.hasAction ? "GREEN" : "RED"}>
						Action
					</Tag>

					<Tag
						className={clsx(hasErrorBoundary && "rounded-br-none rounded-tr-none")}
						color={hasErrorBoundary ? "GREEN" : "RED"}
					>
						ErrorBoundary
					</Tag>
				</div>
				{hasErrorBoundary ? (
					<div className="mr-2">
						{hasParentErrorBoundary ? `Covered by parent ErrorBoundary located in: ${errorBoundaryId}` : ""}
					</div>
				) : null}
			</div>
			{hasWildcard && (
				<>
					<p className="mb-2 text-gray-500">Wildcard parameters:</p>
					<div className={clsx("mb-4 grid w-full grid-cols-2 gap-2", isTreeView && "grid-cols-1")}>
						{routeToUse.url
							.split("/")
							.filter((p) => p.startsWith(":"))
							.map((param) => (
								<div key={param} className="flex w-full gap-2">
									<Tag key={param} color="BLUE">
										{param}
									</Tag>
									<Input
										value={routeWildcards[route.id]?.[param] || ""}
										onChange={(e) =>
											setSettings({
												routeWildcards: {
													...routeWildcards,
													[route.id]: {
														...routeWildcards[route.id],
														[param]: e.target.value,
													},
												},
											})
										}
										placeholder={param}
									/>
								</div>
							))}
					</div>
				</>
			)}
			{isTreeView && (
				<button
					type="button"
					className="mr-2 whitespace-nowrap !text-white rounded border border-gray-400 px-2 py-1 text-sm"
					onClick={openNewRoute(path)}
				>
					<Link className="text-white" to={path}>
						Open in browser
					</Link>
				</button>
			)}
		</div>
	)
}
