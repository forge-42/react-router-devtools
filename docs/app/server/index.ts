import { createHonoServer } from "react-router-hono-server/node"
import { i18next } from "remix-hono/i18next"
import i18nextOpts from "../localization/i18n.server"
import { getLoadContext } from "./context"

export default await createHonoServer({
	configure(server) {
		server.use("*", i18next(i18nextOpts))
	},
	defaultLogger: false,
	getLoadContext,
})
