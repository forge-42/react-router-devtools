import { parse } from "@babel/parser"
/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { NodePath } from "@babel/traverse"

import * as t from "@babel/types"

export { parse, t }
import generate from "@babel/generator"
import traverse from "@babel/traverse"
export const trav =
	typeof (traverse as any).default !== "undefined"
		? ((traverse as any).default as typeof import("@babel/traverse").default)
		: traverse

export const gen =
	typeof (generate as any).default !== "undefined"
		? ((generate as any).default as typeof import("@babel/generator").default)
		: generate
