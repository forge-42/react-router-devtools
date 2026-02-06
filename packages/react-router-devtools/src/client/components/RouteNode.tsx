import type { CSSProperties } from "react"
import type { CustomNodeElementProps } from "react-d3-tree"
import type { useNavigate } from "react-router"
import type { RouteWildcards } from "../context/rdtReducer.js"
import type { ExtendedRoute } from "../utils/routing.js"

type Route = Pick<ExtendedRoute, "id" | "index" | "path" | "parentId">

function getRouteType(route: Route) {
	if (route.id === "root") {
		return "ROOT"
	}
	if (route.index) {
		return "ROUTE"
	}
	if (!route.path) {
		// Pathless layout route
		return "LAYOUT"
	}

	if (!window.__reactRouterManifest) {
		return "ROUTE"
	}
	// Find an index route with parentId set to this route
	const childIndexRoute = Object.values(window.__reactRouterManifest.routes).find(
		(r) => r?.parentId === route.id && r.index
	)

	return childIndexRoute ? "LAYOUT" : "ROUTE"
}

function getRouteFillColor(route: Route): string {
	const isDiscovered = !!window.__reactRouterManifest?.routes[route.id]
	const routeType = getRouteType(route)

	// Map colors: GREEN -> #10b981, BLUE -> #3b82f6, PURPLE -> #a855f7
	const colors = {
		GREEN: isDiscovered ? "#10b981" : "rgba(16, 185, 129, 0.2)",
		BLUE: isDiscovered ? "#3b82f6" : "rgba(59, 130, 246, 0.2)",
		PURPLE: isDiscovered ? "#a855f7" : "rgba(168, 85, 247, 0.2)",
	}

	switch (routeType) {
		case "ROOT":
			return colors.PURPLE
		case "ROUTE":
			return colors.GREEN
		case "LAYOUT":
			return colors.BLUE
	}
}

export const RouteNode = ({
	nodeDatum,
	hierarchyPointNode,
	toggleNode,
	setActiveRoute,
	activeRoutes,
	navigate,
}: CustomNodeElementProps & {
	routeWildcards: RouteWildcards
	setActiveRoute: (e: ExtendedRoute) => void
	activeRoutes: string[]
	navigate: ReturnType<typeof useNavigate>
}) => {
	const parent = hierarchyPointNode.parent?.data
	const parentName = parent && parent?.name !== "/" ? parent.name : ""
	const name = nodeDatum.name.replace(parentName, "") ?? "/"
	// biome-ignore lint/suspicious/noExplicitAny: we are casting it
	const route = { ...nodeDatum, ...nodeDatum.attributes } as any as ExtendedRoute

	const circleFillColor = getRouteFillColor(route)
	const isCollapsed = nodeDatum.__rd3t.collapsed && nodeDatum.children?.length

	const circleStyle: CSSProperties = {
		fill: isCollapsed ? "#1f2937" : circleFillColor,
		stroke: "#ffffff",
		color: "#ffffff",
	}

	const textStyle: CSSProperties = {
		width: 100,
		fontSize: 14,
		wordBreak: "break-all",
		fill: "#ffffff",
		stroke: "transparent",
		color: activeRoutes.includes(route.id) ? "#eab308" : "#ffffff",
	}

	return (
		<g style={{ display: "flex" }}>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: we don't want to do this rule */}
			<circle x={20} onClick={toggleNode} style={circleStyle} r={12} />
			<g>
				<foreignObject y={-15} x={17} width={110} height={140}>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<p
						onClick={() => setActiveRoute(route)}
						onDoubleClickCapture={() => {
							navigate(route.url)
						}}
						style={textStyle}
					>
						{nodeDatum.attributes?.id === "root" ? "Root" : name ? name : "Index"}
					</p>
				</foreignObject>
			</g>
		</g>
	)
}
