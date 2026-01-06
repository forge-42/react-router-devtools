/**
 * Detects if running in a typegen context
 *
 * Returns true if any of the following conditions are met:
 * - Environment variables: TYPEGEN_RUNNING=1, SAFE_ROUTES_TYPEGEN=1
 * - npm script: npm_lifecycle_event contains "typegen"
 * - Command line arguments: contains "typegen", "type-gen", "react-router typegen", or "safe-routes"
 *
 * @returns true if in typegen context, false otherwise
 */
export function isTypegenContext(): boolean {
	// Check environment variables
	if (
		process.env.TYPEGEN_RUNNING === "1" ||
		process.env.SAFE_ROUTES_TYPEGEN === "1"
	) {
		return true
	}

	// Check npm lifecycle event
	if (process.env.npm_lifecycle_event?.includes("typegen")) {
		return true
	}

	// Check command line arguments
	const args = process.argv.join(" ")
	if (
		args.includes("typegen") ||
		args.includes("type-gen") ||
		args.includes("react-router typegen") ||
		args.includes("safe-routes")
	) {
		return true
	}

	return false
}
