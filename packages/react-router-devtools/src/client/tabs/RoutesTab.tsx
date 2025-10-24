import { type MouseEvent, useEffect, useState } from "react"
import { useMatches, useNavigate } from "react-router"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/Accordion.js"
import { NewRouteForm } from "../components/NewRouteForm.js"
import { useSettingsContext } from "../context/useRDTContext.js"
import { cx, useStyles } from "../styles/use-styles.js"
import { type ExtendedRoute, constructRoutePath, createExtendedRoutes } from "../utils/routing.js"
import { createRouteTree } from "../utils/sanitize.js"

import Tree from "react-d3-tree"
import { RouteInfo } from "../components/RouteInfo.js"
import { RouteNode } from "../components/RouteNode.js"
import { RouteToggle } from "../components/RouteToggle.js"

const RoutesTab = () => {
	const { styles } = useStyles()
	const matches = useMatches()
	const navigate = useNavigate()
	const activeRoutes = matches.map((match) => match.id)
	const { settings } = useSettingsContext()
	const { routeWildcards, routeViewMode } = settings
	const [activeRoute, setActiveRoute] = useState<ExtendedRoute | null>(null)
	const [routes] = useState<ExtendedRoute[]>(createExtendedRoutes() as ExtendedRoute[])
	const [treeRoutes, setTreeRoutes] = useState(createRouteTree(window.__reactRouterManifest?.routes))
	const isTreeView = routeViewMode === "tree"
	const openNewRoute = (path: string) => (e?: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
		e?.preventDefault()
		navigate(path)
	}

	useEffect(function fetchAllRoutesOnMount() {
		import.meta.hot?.send("routes-info")
		// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
		const cb = (event: any) => {
			const parsed = JSON.parse(event)
			// biome-ignore lint/suspicious/noExplicitAny: can be any type
			const data = parsed.data as Record<string, any>[]

			// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
			const routeObject: Record<string, any> = {}
			for (const route of data) {
				routeObject[route.id] = route
			}

			routeObject.root = window.__reactRouterManifest?.routes?.root

			setTreeRoutes(createRouteTree(routeObject))
		}
		import.meta.hot?.on("routes-info", cb)
		return () => {
			import.meta.hot?.off("routes-info", cb)
		}
	}, [])
	return (
		<div className={cx(styles.routesTab.container, !isTreeView && styles.routesTab.containerWithPadding)}>
			<RouteToggle />
			{isTreeView ? (
				<div className={styles.routesTab.treeContainer}>
					<Tree
						translate={{ x: window.innerWidth / 2 - (isTreeView && activeRoute ? 0 : 0), y: 30 }}
						pathClassFunc={(link) =>
							// biome-ignore lint/suspicious/noExplicitAny: need to suppress it as it's always defined
							activeRoutes.includes((link.target.data.attributes as any).id)
								? "stroke-yellow-500"
								: // biome-ignore lint/suspicious/noExplicitAny: need to suppress it as it's always defined
									window.__reactRouterManifest?.routes?.[(link.target.data.attributes as any).id]
									? "stroke-gray-400"
									: "stroke-gray-400/20"
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
				<Accordion className={styles.routesTab.listContainer} type="single" collapsible>
					{
						<AccordionItem value="add-new">
							<AccordionTrigger className={styles.routesTab.addNewItem}>
								<span className={styles.routesTab.addNewTitle}>Add a new route to the project</span>
							</AccordionTrigger>
							<AccordionContent>
								<NewRouteForm />
							</AccordionContent>
						</AccordionItem>
					}
					<div className={styles.routesTab.projectRoutesContainer}>
						<span className={styles.routesTab.projectRoutesTitle}>Project routes</span>
						<hr className={styles.routesTab.projectRoutesDivider} />
					</div>
					{routes?.map((route) => {
						const { path, pathToOpen } = constructRoutePath(route, routeWildcards)
						return (
							<AccordionItem key={route.id} value={route.id}>
								<AccordionTrigger>
									<div className={styles.routesTab.routeAccordionTrigger}>
										<span className={styles.routesTab.routeId} /> {route.url}{" "}
										<div className={styles.routesTab.routeActions}>
											<span className={styles.routesTab.routeUrl}>Url: "{pathToOpen}"</span>
											{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
											<div title={pathToOpen} className={styles.routesTab.openButton} onClick={openNewRoute(path)}>
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
