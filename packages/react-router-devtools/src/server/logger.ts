import chalk from "chalk"
import { getConfig } from "./config.js"

const log = (message: string) => {
	const config = getConfig()
	if (config.silent) {
		return
	}

	// biome-ignore lint/suspicious/noConsole: disable noConsole rule for this line
	console.log(message)
}

export const errorLog = (message: string) => {
	log(`${chalk.redBright.bold("ERROR")} ${message}`)
}

export const redirectLog = (message: string) => {
	log(`${chalk.yellowBright.bold("REDIRECT")} ${message}`)
}

export const infoLog = (message: string) => {
	log(`${chalk.blueBright.bold("INFO")} ${message}`)
}

export const loaderLog = (message: string) => {
	const config = getConfig()
	if (config.logs?.loaders === false) {
		return
	}
	const messageToLog = `${chalk.green.bold("LOADER")} ${message}`
	log(messageToLog)
	return messageToLog
}

export const actionLog = (message: string) => {
	const config = getConfig()
	if (config.logs?.actions === false) {
		return
	}
	const messageToLog = `${chalk.yellowBright.bold("ACTION")} ${message}`
	log(messageToLog)
	return messageToLog
}

// const successLog = (message: string) => {
// log(`${chalk.greenBright.bold("SUCCESS")} ${message}`);
//};

//const warningLog = (message: string) => {
//log(`${chalk.bgYellow(logPrefix("WARNING"))} ${message}`);
//};

// const debugLog = (message: string) => {
// log(`${chalk.bgMagenta(logPrefix("DEBUG"))} ${message}`);
//};
