import type { Tab } from "./client/tabs/index.js"
import type { ExtendedContext } from "./context/extend-context.js"

export { reactRouterDevTools, defineRdtConfig } from "./vite/plugin.js"
// Type exports
export type { EmbeddedDevToolsProps } from "./client/embedded-dev-tools.js"
export type { ReactRouterDevtoolsProps as ReactRouterToolsProps } from "./client/react-router-dev-tools.js"
export type { ExtendedContext } from "./context/extend-context.js"

export type RdtPlugin = (...args: any) => Tab

declare module "react-router" {
	interface LoaderFunctionArgs {
		devTools?: ExtendedContext
	}
	interface ActionFunctionArgs {
		devTools?: ExtendedContext
	}
}
