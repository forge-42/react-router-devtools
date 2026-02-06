import type { Config } from "@react-router/dev/config"

export default {
	future: {
		unstable_viteEnvironmentApi: true,
		unstable_splitRouteModules: true,
		unstable_optimizeDeps: true,
	},
} satisfies Config
