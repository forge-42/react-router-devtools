interface RDTEvent<Type extends string, Data extends Record<string, unknown> | any[]> {
	type: Type
	data: Data
}

export type LoaderEvent = RDTEvent<
	"loader",
	{
		id: string
		executionTime: number
		requestData: any
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
		requestData: any
		responseData: any
		requestHeaders: Record<string, string>
		responseHeaders: Record<string, string>
		timestamp: number
	}
>
