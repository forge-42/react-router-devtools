import { z } from "zod"

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
	GITHUB_OWNER: z.string()?.optional(), // optional - for edit/report an issue for the documentation page
	GITHUB_REPO: z.string()?.optional(), // optional - for edit/report an issue for the documentation page,
	GITHUB_REPO_URL: z.string().optional(), // optional - for navigation to the github repository page
})

type ServerEnv = z.infer<typeof envSchema>
let env: ServerEnv

/**
 * Initializes and parses given environment variables using zod
 * @returns Initialized env vars
 */
function initEnv() {
	// biome-ignore lint/nursery/noProcessEnv: This should be the only place to use process.env directly
	const envData = envSchema.safeParse(process.env)

	if (!envData.success) {
		// biome-ignore lint/suspicious/noConsole: We want this to be logged
		console.error("❌ Invalid environment variables:", envData.error.flatten().fieldErrors)
		throw new Error("Invalid environment variables")
	}

	env = envData.data
	Object.freeze(env)

	// Do not log the message when running tests
	if (env.NODE_ENV !== "test") {
		// biome-ignore lint/suspicious/noConsole: We want this to be logged
		console.log("✅ Environment variables loaded successfully")
	}
	return env
}

export function getServerEnv() {
	if (env) return env
	return initEnv()
}

/**
 * Helper function which returns a subset of the environment vars which are safe expose to the client.
 * Dont expose any secrets or sensitive data here.
 * Otherwise you would expose your server vars to the client if you returned them from here as this is
 * directly sent in the root to the client and set on the window.env
 * @returns Subset of the whole process.env to be passed to the client and used there
 */
export function getClientEnv() {
	const serverEnv = getServerEnv()
	return {
		NODE_ENV: serverEnv.NODE_ENV,
		GITHUB_OWNER: serverEnv.GITHUB_OWNER,
		GITHUB_REPO: serverEnv.GITHUB_REPO,
		GITHUB_REPO_URL: serverEnv.GITHUB_REPO_URL,
	}
}

type ClientEnvVars = ReturnType<typeof getClientEnv>

declare global {
	interface Window {
		env: ClientEnvVars
	}
}
