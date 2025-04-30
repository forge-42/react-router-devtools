
import { route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";
const routes = [...await flatRoutes(),route("outside-path","../outside/route.tsx",) ]
export default routes