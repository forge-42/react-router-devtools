import path, { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import type { Page } from "content-collections-types"
import type { Section } from "content-collections-types"
import type { Version } from "./version-resolvers"
import { getServerEnv } from "~/env.server"

/**
 * Load content-collections outputs
 * Always read from generated-docs
 * If no tags/releases exist → fallback to main branch (production) or current (development)
 * During development, if generated-docs missing → tell user to run generate:docs
 */
export async function loadContentCollections(version: Version) {
	const projectRoot = process.cwd()
	const isDev = getServerEnv().APP_ENV === "development"
	// locally we use the actual content-collections source for DX and hot-reloads
	if (isDev) {
		const { allPages, allSections } = await import("content-collections")
		return { allPages, allSections }
	}
	const genBase = resolve(projectRoot, "generated-docs", version, ".content-collections", "generated")

	const pagesPath = pathToFileURL(path.join(genBase, "allPages.js")).href

	const sectionsPath = pathToFileURL(path.join(genBase, "allSections.js")).href

	const pagesMod = await import(/* @vite-ignore */ pagesPath)
	const sectionsMod = await import(/* @vite-ignore */ sectionsPath)

	const allPages = pagesMod.default as Page[]
	const allSections = sectionsMod.default as Section[]
	if (!Array.isArray(allPages) || !Array.isArray(allSections)) {
		throw new Error(`Generated modules must default-export arrays (allPages/allSections) for version ${version}.`)
	}

	return { allPages, allSections }
}
