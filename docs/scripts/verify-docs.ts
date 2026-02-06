import { existsSync } from "node:fs"
import { resolve } from "node:path"
import chalk from "chalk"

const base = resolve("generated-docs")

if (!existsSync(base)) {
	// biome-ignore lint/suspicious/noConsole: keep console error for debugging
	console.error(
		chalk.red(
			"❌ No generated-docs found. Please run `pnpm run generate:docs` at least once before starting the app.\n"
		)
	)
	process.exit(1)
}
// biome-ignore lint/suspicious/noConsole: keep console log for debugging
console.log(chalk.green("✅ generated-docs folder found."))
