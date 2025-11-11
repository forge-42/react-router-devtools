import type { ClientEventBusConfig, TanStackDevtoolsConfig } from "@tanstack/devtools"
import { TanStackDevtools, type TanStackDevtoolsReactPlugin } from "@tanstack/react-devtools"
import { Logo } from "../components/logo.js"
import type { RdtClientConfig } from "../context/RDTContext.js"
import { EmbeddedDevTools } from "../embedded-dev-tools.js"
import { useStyles } from "../styles/use-styles.js"

export const defineClientConfig = (config: RdtClientConfig) => config

/**
 *
 * @description Injects the dev tools into the Vite App, ONLY meant to be used by the package plugin, do not use this yourself!
 */

type ViteDevToolsConfig = {
	config?: RdtClientConfig
	tanstackConfig?: Partial<Omit<TanStackDevtoolsConfig, "customTrigger">>
	plugins?: Array<TanStackDevtoolsReactPlugin>
	tanstackClientBusConfig?: Partial<ClientEventBusConfig>
}

export const withViteDevTools =
	(
		// biome-ignore lint/suspicious/noExplicitAny: we don't know or care about props type
		Component: any,
		viteConfig?: ViteDevToolsConfig
	) =>
	// biome-ignore lint/suspicious/noExplicitAny: we don't know or care about props type
	(props: any) => {
		// Extract config parts
		const tanStackDevtoolsConfig = viteConfig?.tanstackConfig
		const clientBusConfig = viteConfig?.tanstackClientBusConfig
		// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type here as we spread it below
		function AppWithDevTools(props: any) {
			const { styles } = useStyles()
			return (
				<>
					<Component {...props} />
					<TanStackDevtools
						config={{
							...tanStackDevtoolsConfig,
							customTrigger: (
								<div data-testid="react-router-devtools-trigger" className={styles.tanstackTrigger.container}>
									<Logo className={styles.tanstackTrigger.logo} />
								</div>
							),
						}}
						eventBusConfig={{
							...clientBusConfig,
							connectToServerBus: true,
						}}
						plugins={[
							{ name: "React Router", render: <EmbeddedDevTools />, defaultOpen: true },
							...(viteConfig?.plugins || []),
						]}
					/>
				</>
			)
		}
		return AppWithDevTools(props)
	}
