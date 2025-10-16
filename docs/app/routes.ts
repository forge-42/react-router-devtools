import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
	index("routes/index.tsx"),
	route("search", "routes/search.ts"),
	layout("routes/documentation-layout.tsx", [
		route(":version?/home", "routes/documentation-homepage.tsx"),
		route(":version/:section?/:subsection?/:filename", "routes/documentation-page.tsx"),
	]),
	route("sitemap-index.xml", "routes/sitemap-index[.]xml.ts"),
	route("robots.txt", "routes/robots[.]txt.ts"),
	route("resource/*", "routes/resource.locales.ts"),
	route("$", "routes/$.tsx"),
	route("sitemap/:lang.xml", "routes/sitemap.$lang[.]xml.ts"),
	route(":version?/llms.txt", "routes/llms[.]txt.ts"),
] satisfies RouteConfig
