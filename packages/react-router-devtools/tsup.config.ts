import { defineConfig } from "tsdown"

export default defineConfig({
	entry: ["src/index.ts", "src/client.ts", "src/server.ts", "src/context.ts"],
	sourcemap: false,
	clean: false,
	dts: true,
	outputOptions: {
		cssChunkFileNames: "[name].css",
	},
	format: ["esm"],
	external: ["react"],
})
