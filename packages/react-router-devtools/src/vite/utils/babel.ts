import { parse } from "@babel/parser"

import * as t from "@babel/types"

export { parse, t }
import generate from "@babel/generator"
import traverse from "@babel/traverse"
export const trav =
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
	typeof (traverse as any).default !== "undefined"
		? // biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
			((traverse as any).default as typeof import("@babel/traverse").default)
		: traverse

export const gen =
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
	typeof (generate as any).default !== "undefined"
		? // biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
			((generate as any).default as typeof import("@babel/generator").default)
		: generate
