import type { Page } from "content-collections"
import type { SidebarSection } from "~/utils/create-sidebar-tree"
import { buildBreadcrumbs } from "../build-breadcrumbs"

const makePage = (slug: string, title: string, section = slug.split("/")[0] ?? ""): Page => ({
	content: "",
	slug,
	section,
	rawMdx: "",
	title,
	summary: "",
	description: "",
	_meta: {
		filePath: "",
		fileName: "",
		directory: "",
		path: "",
		extension: ".mdx",
	},
})

const makeSection = (overrides: Partial<SidebarSection> = {}): SidebarSection => ({
	title: "",
	slug: "",
	documentationPages: [],
	subsections: [],
	...overrides,
})

const makeStandalone = (slug: string, title: string): Pick<Page, "title" | "slug"> => ({
	slug,
	title,
})

describe("buildBreadcrumbs", () => {
	it("returns [] when pathname doesn't match any doc", () => {
		const items: SidebarSection[] = [
			makeSection({
				title: "Getting Started",
				slug: "getting-started",
				documentationPages: [makePage("getting-started/intro", "Intro")],
			}),
		]

		expect(buildBreadcrumbs(items, "/getting-started/unknown")).toEqual([])
	})

	it("returns [section, doc] for a top-level doc within a section", () => {
		const items: SidebarSection[] = [
			makeSection({
				title: "Getting Started",
				slug: "getting-started",
				documentationPages: [makePage("getting-started/intro", "Intro")],
			}),
		]

		expect(buildBreadcrumbs(items, "/getting-started/intro")).toEqual(["Getting Started", "Intro"])
	})

	it("returns full trail for a nested doc (root → sub → doc)", () => {
		const items: SidebarSection[] = [
			makeSection({
				title: "Configuration",
				slug: "configuration",
				subsections: [
					makeSection({
						title: "Advanced",
						slug: "configuration/advanced",
						documentationPages: [makePage("configuration/advanced/tuning", "Tuning")],
					}),
				],
				documentationPages: [makePage("configuration/setup", "Setup")],
			}),
		]

		expect(buildBreadcrumbs(items, "/configuration/advanced/tuning")).toEqual(["Configuration", "Advanced", "Tuning"])
	})

	it("returns [] for an empty sidebar", () => {
		const items: SidebarSection[] = []
		expect(buildBreadcrumbs(items, "/any-path")).toEqual([])
	})

	it("returns [doc] for a standalone top-level doc", () => {
		const items: SidebarSection[] = []
		const standalone = [makeStandalone("changelog", "Changelog")]

		expect(buildBreadcrumbs(items, "/changelog", standalone)).toEqual(["Changelog"])
	})

	it("matches sectioned path when pathname is sectioned, and standalone when pathname is standalone", () => {
		const items: SidebarSection[] = [
			makeSection({
				title: "Guides",
				slug: "guides",
				documentationPages: [makePage("guides/quickstart", "Quickstart")],
			}),
		]
		const standalone = [makeStandalone("quickstart", "Quickstart")]

		expect(buildBreadcrumbs(items, "/guides/quickstart", standalone)).toEqual(["Guides", "Quickstart"])

		expect(buildBreadcrumbs(items, "/quickstart", standalone)).toEqual(["Quickstart"])
	})
})
