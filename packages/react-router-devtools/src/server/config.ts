export interface DevToolsServerConfig {
	/**
	 * Whether to log in the console, this turns off ALL logging
	 * If you want to be granulat use the logs option
	 * @default true
	 */
	silent?: boolean
	/**
	 * The threshold for server timings to be logged in the console
	 * If the server timing is greater than this threshold, it will be logged in red, otherwise it will be logged in green
	 * @default Number.POSITIVE_INFINITY
	 *
	 */
	serverTimingThreshold?: number
	logs?: {
		/**
		 * Whether to log cookie headers in the console
		 * @default true
		 */
		cookies?: boolean
		/**
		 * Whether to log deferred loaders  in the console
		 * @default true
		 */
		defer?: boolean
		/**
		 * Whether to log action calls in the console
		 * @default true
		 * */
		actions?: boolean
		/**
		 * Whether to log loader calls in the console
		 * @default true
		 */
		loaders?: boolean
		/**
		 * Whether to log cache headers in the console
		 * @default true
		 */
		cache?: boolean
		/**
		 * Whether to log site clear headers in the console
		 * @default true
		 */
		siteClear?: boolean
		/**
		 * Whether to log server timings headers in the console
		 * @default true
		 */
		serverTimings?: boolean
		/**
		 * Whether to log middleware calls in the console
		 * @default true
		 */
		middleware?: boolean
	}
}
declare global {
	namespace NodeJS {
		interface Process {
			rdt_config: DevToolsServerConfig
			rdt_port: number
		}
	}
}
export const defineServerConfig = (config: DevToolsServerConfig) => config

export const getConfig = () => process.rdt_config ?? { silent: true }
