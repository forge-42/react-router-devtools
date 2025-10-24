import type { RdtClientConfig } from "./context/RDTContext.js"
import type { Tab } from "./tabs/index.js"
import "../input.css"
import type { RdtPlugin } from "../index.js"

export interface ReactRouterDevtoolsProps {
	// Additional tabs to add to the dev tools
	plugins?: (Tab | RdtPlugin)[]
	config?: RdtClientConfig
}
