import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes"


export default [
	route("outside", "./routes/_index.tsx", { id: "something" }),

] satisfies RouteConfig
