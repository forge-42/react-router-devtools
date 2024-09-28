import { useMatches, useNavigate } from "@remix-run/react"
import { type MouseEvent, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/Accordion.js"
import { NewRouteForm } from "../components/NewRouteForm.js"
import { useDetachedWindowControls, useSettingsContext } from "../context/useRDTContext.js"
import { setRouteInLocalStorage } from "../hooks/detached/useListenToRouteChange.js"
import { type ExtendedRoute, constructRoutePath, createExtendedRoutes } from "../utils/routing.js"
import { createRouteTree } from "../utils/sanitize.js"

import clsx from "clsx"
import Tree from "react-d3-tree"
import { RouteInfo } from "../components/RouteInfo.js"
import { RouteNode } from "../components/RouteNode.js"
import { RouteToggle } from "../components/RouteToggle.js"

const RoutesTab = () => {
	const matches = useMatches()
	const navigate = useNavigate()
	const activeRoutes = matches.map((match) => match.id)
	const { settings } = useSettingsContext()
	const { routeWildcards, routeViewMode } = settings
	//const { isConnected } = useRemixForgeSocket()
	const { detachedWindow } = useDetachedWindowControls()
	const [activeRoute, setActiveRoute] = useState<ExtendedRoute | null>(null)
	const [routes] = useState<ExtendedRoute[]>(createExtendedRoutes())
	const [treeRoutes] = useState(createRouteTree(window.__remixManifest.routes))
	const isTreeView = routeViewMode === "tree"
	const openNewRoute = (path: string) => (e?: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
		e?.preventDefault()
		navigate(path)
		if (detachedWindow) {
			setRouteInLocalStorage(path)
		}
	}

	return (
		<div className={clsx("relative h-full w-full ", !isTreeView && "pt-8")}>
			<RouteToggle />
			{isTreeView ? (
				<div className="flex h-full w-full">
					<Tree
						translate={{ x: window.innerWidth / 2 - (isTreeView && activeRoute ? 0 : 0), y: 30 }}
						pathClassFunc={(link) =>
							activeRoutes.includes((link.target.data.attributes as any).id) ? "stroke-yellow-500" : "stroke-gray-400"
						}
						renderCustomNodeElement={(props) =>
							RouteNode({
								...props,
								routeWildcards,
								setActiveRoute,
								activeRoutes,
								navigate,
							})
						}
						orientation="vertical"
						data={treeRoutes}
					/>
					{activeRoute && (
						<RouteInfo
							openNewRoute={openNewRoute}
							onClose={() => setActiveRoute(null)}
							route={activeRoute}
							className="w-[600px] border-l border-l-slate-800 p-2 px-4"
						/>
					)}
				</div>
			) : (
				<Accordion className="h-full w-full overflow-y-auto pr-4" type="single" collapsible>
					{/* TODO bring back */}
					{false && (
						<AccordionItem value="add-new">
							<AccordionTrigger className="text-white">Add a new route to the project</AccordionTrigger>
							<AccordionContent>
								<NewRouteForm />
							</AccordionContent>
						</AccordionItem>
					)}
					<div className="py-2">
						<span className="text-lg font-semibold">Project routes</span>
						<hr className="mt-2 border-gray-400" />
					</div>
					{routes?.map((route) => {
						const { path, pathToOpen } = constructRoutePath(route, routeWildcards)
						return (
							<AccordionItem key={route.id} value={route.id}>
								<AccordionTrigger>
									<div className="justify-center flex-wrap text-white flex px-3 lg:px-0 flex-col lg:flex-row w-full items-start lg:items-center gap-1 ">
										<span className="text-gray-500" /> {route.url}{" "}
										<div className="lg:ml-auto flex-wrap flex items-center gap-2">
											<span className=" text-left text-xs text-gray-500">Url: "{pathToOpen}"</span>
											{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
											<div
												title={pathToOpen}
												className="mr-2  whitespace-nowrap rounded border border-gray-400 px-2 py-1 text-sm"
												onClick={openNewRoute(path)}
											>
												Open in browser
											</div>
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<RouteInfo openNewRoute={openNewRoute} route={route} />
								</AccordionContent>
							</AccordionItem>
						)
					})}
				</Accordion>
			)}
		</div>
	)
}

export { RoutesTab }
