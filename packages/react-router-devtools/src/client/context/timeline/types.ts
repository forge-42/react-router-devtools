import type { FormEncType } from "react-router"

interface NormalRedirectEvent {
	type: "REDIRECT"
	to: string
	search: string
	hash: string
	method: "GET"
	id: string
	responseData?: Record<string, any>
}
interface FetcherRedirectEvent extends Omit<NormalRedirectEvent, "type"> {
	type: "FETCHER_REDIRECT"
}

interface FetcherSubmissionEvent extends Omit<FormSubmissionEvent, "type" | "from"> {
	type: "FETCHER_SUBMIT"
	key?: string
	responseData?: Record<string, any>
}
interface FetcherSubmissionResponseEvent extends Omit<FormSubmissionEvent, "type" | "from"> {
	type: "FETCHER_RESPONSE"
	key?: string
	responseData?: Record<string, any>
}
interface FormSubmissionEvent {
	type: "FORM_SUBMISSION"
	id: string
	to: string
	data?: Record<string, any>
	responseData?: Record<string, any>
	method: "get" | "post" | "put" | "patch" | "delete" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
	from: string
	encType?: FormEncType
}
interface ActionRedirectEvent extends Omit<FormSubmissionEvent, "type"> {
	type: "ACTION_REDIRECT"
}
interface ActionResponseEvent extends Omit<FormSubmissionEvent, "type"> {
	type: "ACTION_RESPONSE"
}
export type RedirectEvent = NormalRedirectEvent | FetcherRedirectEvent
export type FormEvent =
	| FormSubmissionEvent
	| FetcherSubmissionEvent
	| ActionRedirectEvent
	| FetcherSubmissionResponseEvent
	| ActionResponseEvent

export type TimelineEvent = RedirectEvent | FormEvent
