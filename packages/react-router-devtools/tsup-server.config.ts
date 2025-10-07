import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/server.ts"],
	splitting: false,
	sourcemap: false,
	clean: false,
	dts: true,
	format: ["esm"],
})
