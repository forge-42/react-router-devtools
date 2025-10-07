import { useMemo } from "react"
import { type To, useSearchParams } from "react-router"
import type { Language } from "~/localization/resource"

/**
 * Enhances the default to prop by adding the language to the search params and conditionally keeping the search params
 * @param language The language to use over the search param language
 * @param to The new location to navigate to
 * @param keepSearchParams Whether to keep the search params or not
 *
 * @example
 * ```tsx
 * // override the language
 * function Component(){
 * 	const enhancedTo = useEnhancedTo({ language: "en", to: "/" })
 * 	return <Link to={enhancedTo} /> // Will navigate to /?lng=en even if the current url contains a different lanugage
 * }
 *
 * function Component(){
 * 	const enhancedTo = useEnhancedTo({ to: "/" })
 * 	return <Link to={enhancedTo} /> // Will navigate to /?lng=X where X is the current language in the url search params, or just to / if no language is found
 * }
 *
 * function Component(){
 * 	const enhancedTo = useEnhancedTo({ to: "/", keepSearchParams: true })
 * 	return <Link to={enhancedTo} /> // Will navigate to /?params=from_the_url_search_params&lng=en
 * }
 * ```
 */
export const useEnhancedTo = ({
	language,
	to,
	keepSearchParams,
}: { language?: Language; to: To; keepSearchParams?: boolean }) => {
	const [params] = useSearchParams()
	const { lng, ...searchParams } = Object.fromEntries(params.entries())
	// allow language override for language switcher or manually setting the language in specific cases
	const lang = language ?? params.get("lng")
	const newSearchParams = new URLSearchParams(searchParams)
	const searchString = newSearchParams.toString()
	const hasSearchParams = searchString.length > 0
	const appendSearchParams = lang || hasSearchParams
	const newPath = useMemo(
		() =>
			to +
			(appendSearchParams
				? `?${keepSearchParams && hasSearchParams ? `${searchString}${lang ? "&" : ""}` : ""}${lang ? `lng=${lang}` : ""}`
				: ""),
		[to, appendSearchParams, keepSearchParams, hasSearchParams, searchString, lang]
	)
	return newPath
}
