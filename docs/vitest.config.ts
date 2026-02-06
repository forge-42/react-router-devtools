import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		css: true,
		coverage: {
			all: false,
			include: ["app/**"],
			reporter: ["text", "json-summary", "json"],
			reportOnFailure: true,
		},
	},
})
