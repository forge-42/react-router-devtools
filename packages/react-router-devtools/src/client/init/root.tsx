import { TanStackDevtools } from "@tanstack/react-devtools"
import { Logo } from "../components/logo.js"
import type { RdtClientConfig } from "../context/RDTContext.js"
import { EmbeddedDevTools } from "../embedded-dev-tools.js"
import type { ReactRouterDevtoolsProps } from "../react-router-dev-tools.js"
import { useStyles } from "../styles/use-styles.js"

export const defineClientConfig = (config: RdtClientConfig) => config

/**
 *
 * @description Injects the dev tools into the Vite App, ONLY meant to be used by the package plugin, do not use this yourself!
 */

// biome-ignore lint/suspicious/noExplicitAny: we don't know or care about props type
export const withViteDevTools = (Component: any, _config?: ReactRouterDevtoolsProps) => (props: any) => {
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type here as we spread it below
	function AppWithDevTools(props: any) {
		const { styles } = useStyles()
		return (
			<>
				<Component {...props} />
				<TanStackDevtools
					config={{
						customTrigger: (
							<div data-testid="react-router-devtools-trigger" className={styles.tanstackTrigger.container}>
								<Logo className={styles.tanstackTrigger.logo} />
							</div>
						),
					}}
					eventBusConfig={{
						connectToServerBus: true,
					}}
					plugins={[{ name: "React Router Devtools", render: <EmbeddedDevTools /> }]}
				/>
			</>
		)
	}
	return AppWithDevTools(props)
}
