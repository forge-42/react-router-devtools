import { generateAction } from "./action"
import { generateClientAction } from "./clientAction"
import { generateClientLoader } from "./clintLoader"
import { generateComponent } from "./component"
import { generateDependencies } from "./dependencies"
import { generateErrorBoundary } from "./errorBoundary"
import { generateHandler } from "./handler"
import { generateHeaders } from "./headers"
import { generateLinks } from "./links"
import { generateLoader } from "./loader"
import { generateMeta } from "./meta"
import { generateRevalidate } from "./revalidate"

export const GENERATORS = {
	action: generateAction,
	component: generateComponent,
	errorBoundary: generateErrorBoundary,
	handler: generateHandler,
	headers: generateHeaders,
	links: generateLinks,
	loader: generateLoader,
	clientLoader: generateClientLoader,
	clientAction: generateClientAction,
	meta: generateMeta,
	revalidate: generateRevalidate,
	dependencies: generateDependencies,
} as const

export type Generator = keyof typeof GENERATORS
