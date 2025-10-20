import { Link as ReactRouterLink, type LinkProps as ReactRouterLinkProps } from "react-router"
import type { Language } from "~/localization/resource"
import { useEnhancedTo } from "./useEnhancedTo"

export interface LinkProps extends ReactRouterLinkProps {
	keepSearchParams?: boolean
	language?: Language
}

export const Link = ({
	prefetch = "intent",
	viewTransition = true,
	keepSearchParams = false,
	to,
	language,
	...props
}: LinkProps) => {
	const enhancedTo = useEnhancedTo({ language, to, keepSearchParams })
	return <ReactRouterLink prefetch={prefetch} viewTransition={viewTransition} to={enhancedTo} {...props} />
}
