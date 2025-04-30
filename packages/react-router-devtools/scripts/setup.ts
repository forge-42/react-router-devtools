import { spawn } from "node:child_process"
import chalk from "chalk"
import prompt from "prompt"
// Helper method used to verify the run
const verifyRun = async () => {
	// biome-ignore lint/suspicious/noConsole: disable noConsole rule for this line
	console.log("About to execute the command")

	const { sure } = await prompt.get([
		{ name: "sure", description: "Are you sure? (y/n)", type: "string", required: true },
	])

	if (sure !== "y") {
		// biome-ignore lint/suspicious/noConsole: disable noConsole rule for this line
		console.log(chalk.bold.red("Command aborted!\n"))
		process.exit(1)
	}
}

if (!process.argv[2]) {
	chalk.red("Missing command to run argument")
	process.exit(1)
}

// Main command to run
const main = () => {
	const commandOrScript = process.argv[2]
	// Allows us to run scripts from the scripts folder and prisma commands from the prisma folder without having to wrap them in package.json with npm run run:scripts
	const command =
		commandOrScript.startsWith("scripts/") || commandOrScript.startsWith("prisma/")
			? `npm run run:scripts ${commandOrScript}`
			: commandOrScript

	// Filter out the script command and the environment (the slice(3) part) and remove our custom args and pass everything else down
	const filteredArgs = process.argv.slice(3).filter((arg) => arg !== "verify")
	// Spawns a child process with the command to run
	// param 1 - command to run
	// param 2 - arguments to pass to the command
	// param 3 - options for the child process
	const child = spawn(command, filteredArgs, {
		cwd: process.cwd(),
		stdio: "inherit",
		shell: true,
	})
	// If the child process exits, exit the parent process too if the exit code is not 0
	child.on("exit", (exitCode) => {
		if (exitCode !== 0) {
			process.exit(exitCode ?? 1)
		}
	})
	//
	// biome-ignore lint/complexity/noForEach: <explanation>
	;["SIGINT", "SIGTERM"].forEach((signal) => {
		process.on(signal, () => {
			// Kills the child only if it is still connected and alive
			if (child.connected) {
				child.kill(child.pid)
			}
			process.exit(1)
		})
	})
}

// Makes the user confirm the run if the verify argument is passed
if (process.argv.includes("verify")) {
	verifyRun()
		.then(() => {
			main()
		})
		.catch(() => process.exit(1))

	// If the verify argument is not passed, just run the command
} else {
	main()
}
