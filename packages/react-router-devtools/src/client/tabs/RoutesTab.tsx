import { type MouseEvent, useEffect, useState } from "react"
import { useMatches, useNavigate } from "react-router"
import { eventClient } from "../../shared/event-client.js"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/Accordion.js"
import { NewRouteForm } from "../components/NewRouteForm.js"
import { TabContent } from "../components/TabContent.js"
import { TabHeader } from "../components/TabHeader.js"
import { Icon } from "../components/icon/Icon.js"
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
	const [routes, setRoutes] = useState<ExtendedRoute[]>(createExtendedRoutes() as ExtendedRoute[])
	const [treeRoutes, setTreeRoutes] = useState(createRouteTree(window.__reactRouterManifest?.routes))
	const isTreeView = routeViewMode === "tree"
	const openNewRoute = (path: string) => (e?: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
		e?.preventDefault()
		navigate(path)
	}

	useEffect(function fetchAllRoutesOnMount() {
		// Listen for routes info response from the server FIRST
		const unsubscribe = eventClient.on("routes-info", (event) => {
			const data = event.payload

			// Build route object from server routes data
			// biome-ignore lint/suspicious/noExplicitAny: can be any type
			const routeObject: Record<string, any> = {}
			for (const route of data) {
				routeObject[route.id] = route
			}

			// Add root from manifest
			routeObject.root = window.__reactRouterManifest?.routes?.root

			// Update tree view routes with merged data
			setTreeRoutes(createRouteTree(routeObject))

			// Update list view routes - pass the server routes directly
			const updatedRoutes = createExtendedRoutes(routeObject) as ExtendedRoute[]
			setRoutes(updatedRoutes)
		})

		// Request routes info from the server AFTER listener is set up
		eventClient.emit("routes-tab-mounted", {})

		return () => {
			unsubscribe()
		}
	}, [])
	return (
		<div className={styles.routesTab.wrapper}>
			<TabHeader icon={<Icon name="GitMerge" />} title="Routes" rightContent={<RouteToggle />} />
			<div className={cx(styles.routesTab.container, !isTreeView && styles.routesTab.containerWithPadding)}>
				{isTreeView ? (
					<div className={styles.routesTab.treeContainer}>
						<Tree
							translate={{ x: window.innerWidth / 2 - (isTreeView && activeRoute ? 0 : 0), y: 30 }}
							pathClassFunc={(link) => {
								// biome-ignore lint/suspicious/noExplicitAny: need to suppress it as it's always defined
								const targetId = (link.target.data.attributes as any).id
								if (activeRoutes.includes(targetId)) {
									return styles.routesTab.strokeYellow
								}
								if (window.__reactRouterManifest?.routes?.[targetId]) {
									return styles.routesTab.strokeGray
								}
								return styles.routesTab.strokeGrayMuted
							}}
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
					<div className={styles.routesTab.listContainer}>
						<TabContent>
							<Accordion type="single" collapsible>
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
														<div
															title={pathToOpen}
															className={styles.routesTab.openButton}
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
						</TabContent>
					</div>
				)}
			</div>
		</div>
	)
}

export { RoutesTab }
