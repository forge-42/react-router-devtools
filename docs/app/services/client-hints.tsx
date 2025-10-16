import { getHintUtils } from "@epic-web/client-hints"
import { clientHint as colorSchemeHint, subscribeToSchemeChange } from "@epic-web/client-hints/color-scheme"
import { clientHint as reducedMotionHint, subscribeToMotionChange } from "@epic-web/client-hints/reduced-motion"
import { clientHint as timeZoneHint } from "@epic-web/client-hints/time-zone"
import { useEffect } from "react"
import { useRevalidator, useRouteLoaderData } from "react-router"
import type { Route } from "../+types/root"

export const { getHints, getClientHintCheckScript } = getHintUtils({
	theme: colorSchemeHint,
	timeZone: timeZoneHint,
	reducedMotion: reducedMotionHint,
	// add other hints here
})

/**
 * @public
 * Utility function used to get the time zone for the current users browser on either the client or the server.
 *  */
export const getTimeZone = (request?: Request) => getHints(request).timeZone

/**
 * @public
 * Utility used to get the client hints for the current users browser.
 * 	*/
export function useHints() {
	const requestInfo = useRouteLoaderData<Route.ComponentProps["loaderData"]>("root")
	return requestInfo?.hints
}
/**
 * Utility component used to check the client hints on the client and send them to the server.
 */
export function ClientHintCheck({ nonce }: { nonce?: string }) {
	const { revalidate } = useRevalidator()
	useEffect(() => subscribeToSchemeChange(() => revalidate()), [revalidate])
	useEffect(() => subscribeToMotionChange(() => revalidate()), [revalidate])

	return (
		<script
			nonce={nonce}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: We want to run this script on the client
			dangerouslySetInnerHTML={{
				__html: getClientHintCheckScript(),
			}}
		/>
	)
}
