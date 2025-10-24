import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts"],
	splitting: false,
	sourcemap: false,
	clean: false,
	dts: true,
	format: ["esm"],
	external: ["vite-node"],
	loader: {
		".svg": "dataurl",
	},
})
