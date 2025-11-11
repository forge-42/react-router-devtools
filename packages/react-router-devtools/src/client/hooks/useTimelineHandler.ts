import { useEffect, useRef } from "react"
import { useActionData, useFetchers, useNavigation } from "react-router"
import type { TimelineEvent } from "../context/timeline/types.js"
import { useTimelineContext } from "../context/useRDTContext.js"

const uniqueId = () => (Math.random() * Date.now()).toString()

const convertFormDataToObject = (formData: FormData | undefined) => {
	// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
	const obj: any = {}
	if (!formData) {
		return undefined
	}

	for (const key of formData.keys()) {
		if (key.includes(".")) {
			const [prefix, suffix] = key.split(".")
			if (Number.isNaN(Number.parseInt(suffix))) {
				obj[prefix] ??= {}
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				for (const [_, element] of formData.getAll(key).entries()) {
					obj[prefix][suffix] = element
				}
			} else {
				obj[prefix] ??= []
				for (const [index, element] of formData.getAll(key).entries()) {
					if (index > 1) {
						obj[prefix][suffix] = [...obj[prefix][suffix], element]
					} else if (index === 1) {
						obj[prefix][suffix] = [obj[prefix][suffix], element]
					} else {
						obj[prefix][suffix] = element
					}
				}
			}
		} else {
			for (const [index, element] of formData.getAll(key).entries()) {
				if (index > 1) {
					obj[key] = [...obj[key], element]
				} else if (index === 1) {
					obj[key] = [obj[key], element]
				} else {
					obj[key] = element
				}
			}
		}
	}
	if (Object.keys(obj).length === 0) {
		return undefined
	}
	return obj
}

const useTimelineHandler = () => {
	const navigation = useNavigation()
	const fetchers = useFetchers()
	const navigationEventQueue = useRef<TimelineEvent[]>([])
	const { setTimelineEvent } = useTimelineContext()
	const responseData = useActionData()
	useEffect(() => {
		const { state, location, formAction, formData, formMethod, formEncType } = navigation

		if (state === "idle") {
			navigationEventQueue.current.map((event) =>
				setTimelineEvent({
					...event,
					id: uniqueId(),
				})
			)
			navigationEventQueue.current = []
			return
		}
		const { state: locState, pathname, search, hash } = location
		const data = convertFormDataToObject(formData)
		// Form submission handler
		if (state === "submitting") {
			navigationEventQueue.current.push({
				type: "FORM_SUBMISSION",
				from: pathname,
				to: formAction,
				method: formMethod,
				data,
				encType: formEncType,
				id: uniqueId(),
			})
			return
		}
		if (state === "loading") {
			// Form submitted => action is redirecting the user
			if (formAction && formData && formMethod && locState?._isRedirect) {
				navigationEventQueue.current.push({
					type: "ACTION_REDIRECT",
					from: pathname,
					to: formAction,
					method: formMethod,
					data,
					encType: formEncType,
					// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
					responseData: responseData as any,
					id: uniqueId(),
				})
				return
			}
			// Form submitted => action is responding with data
			if (formAction && formData && formMethod) {
				navigationEventQueue.current.push({
					type: "ACTION_RESPONSE",
					from: pathname,
					to: formAction,
					method: formMethod,
					data,
					encType: formEncType,
					// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
					responseData: responseData as any,
					id: uniqueId(),
				})
				return
			}

			// Loader/browser is redirecting the user
			navigationEventQueue.current.push({
				type: locState?._isFetchActionRedirect || locState?._isFetchLoaderRedirect ? "FETCHER_REDIRECT" : "REDIRECT",
				to: pathname,
				search,
				hash,
				method: "GET",

				id: uniqueId(),
			})
			return
		}
	}, [navigation, responseData, setTimelineEvent])

	const fetcherEventQueue = useRef<TimelineEvent[]>([])
	// Fetchers handler
	useEffect(() => {
		if (navigation.state !== "idle") return
		const activeFetchers = fetchers.filter((f) => f.state !== "idle")
		// Everything is finished => store the events
		if (activeFetchers.length === 0 && fetcherEventQueue.current.length > 0) {
			// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
			fetcherEventQueue.current.map(({ position, ...event }: any) =>
				setTimelineEvent({
					...event,
					responseData:
						// If the fetcher is a GET request, the response data is stored in the fetcher, otherwise it's already set at this point
						event.method === "GET" ? fetchers[position]?.data : event.responseData,
				})
			)
			fetcherEventQueue.current = []
			return
		}

		fetchers.forEach((fetcher, i) => {
			if (fetcher.state === "idle") return

			const { data, formAction, formData, formEncType, formMethod, key: fetcherKey } = fetcher

			if (formAction && formMethod) {
				const form = convertFormDataToObject(formData)
				const event = {
					type: fetcher.state === "loading" ? "FETCHER_RESPONSE" : "FETCHER_SUBMIT",
					to: formAction,
					method: formMethod,
					...(fetcherKey ? { fetcherKey } : {}),
					data: form,
					encType: formEncType,
					responseData: fetcher.state === "submitting" ? undefined : data,
					position: i,
					id: uniqueId(),
				}
				// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
				fetcherEventQueue.current.push(event as any)
			}
		})
	}, [fetchers, navigation.state, setTimelineEvent])
}

export { useTimelineHandler }
