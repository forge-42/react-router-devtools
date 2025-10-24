import { TanStackDevtools } from "@tanstack/react-devtools"
import type { RdtClientConfig } from "../context/RDTContext.js"
import { RequestProvider } from "../context/requests/request-context.js"
import { EmbeddedDevTools } from "../embedded-dev-tools.js"
import type { ReactRouterDevtoolsProps } from "../react-router-dev-tools.js"
import { hydrationDetector } from "./hydration.js"
import triggerImage from "./trigger.svg"

export const defineClientConfig = (config: RdtClientConfig) => config

/**
 *
 * @description Injects the dev tools into the Vite App, ONLY meant to be used by the package plugin, do not use this yourself!
 */

// biome-ignore lint/suspicious/noExplicitAny: we don't know or care about props type
export const withViteDevTools = (Component: any, _config?: ReactRouterDevtoolsProps) => (props: any) => {
	hydrationDetector()
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type here as we spread it below
	function AppWithDevTools(props: any) {
		return (
			<RequestProvider>
				<Component {...props} />
				<TanStackDevtools
					config={{
						triggerImage,
					}}
					plugins={[{ name: "React Router Devtools", render: <EmbeddedDevTools /> }]}
				/>
			</RequestProvider>
		)
	}
	return AppWithDevTools(props)
}
