// biome-ignore lint/suspicious/noExplicitAny: can be any type
interface RDTEvent<Type extends string, Data extends Record<string, unknown> | any[]> {
	type: Type
	data: Data
}

export type LoaderEvent = RDTEvent<
	"loader",
	{
		id: string
		executionTime: number
		// biome-ignore lint/suspicious/noExplicitAny: can be any type
		requestData: any
		// biome-ignore lint/suspicious/noExplicitAny: can be any type
		responseData: any
		requestHeaders: Record<string, string>
		responseHeaders: Record<string, string>
		timestamp: number
	}
>
export type ActionEvent = RDTEvent<
	"action",
	{
		id: string
		executionTime: number
		// biome-ignore lint/suspicious/noExplicitAny: can be any type
		requestData: any
		// biome-ignore lint/suspicious/noExplicitAny: can be any type
		responseData: any
		requestHeaders: Record<string, string>
		responseHeaders: Record<string, string>
		timestamp: number
	}
>
