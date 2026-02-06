
import { flatRoutes } from "@react-router/fs-routes";
import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes"
import subroutes from "./subroutes.js"



export default [...await flatRoutes(), ...subroutes ]