import type { Page } from "content-collections-types"

export function getPageSlug(page: Page) {
	return page._meta.path === "_index" ? "/" : page.slug
}
