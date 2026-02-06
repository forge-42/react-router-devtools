import type { ExtendedContext } from "./context/extend-context.js"

export { reactRouterDevTools, defineRdtConfig } from "./vite/plugin.js"
export { EmbeddedDevTools } from "./client/embedded-dev-tools.js"
// Type exports
export type { EmbeddedDevToolsProps } from "./client/embedded-dev-tools.js"
export type { ExtendedContext } from "./context/extend-context.js"

declare module "react-router" {
	interface LoaderFunctionArgs {
		devTools?: ExtendedContext
	}
	interface ActionFunctionArgs {
		devTools?: ExtendedContext
	}
}
