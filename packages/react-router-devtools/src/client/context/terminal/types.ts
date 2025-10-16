interface TerminalOutput {
	type: "output" | "command" | "error"
	value: string
}

export interface Terminal {
	id: number
	locked: boolean
	history: string[]
	output: TerminalOutput[]
	processId?: number
}
