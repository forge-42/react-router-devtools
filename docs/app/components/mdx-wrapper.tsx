import { MDXContent } from "@content-collections/mdx/react"
import { Anchor } from "~/ui/anchor-tag"
import { InfoAlert } from "~/ui/info-alert"
import { InlineCode } from "~/ui/inline-code"
import { ListItem } from "~/ui/list-item"
import { OrderedList } from "~/ui/ordered-list"
import { Strong } from "~/ui/strong-text"
import { WarningAlert } from "~/ui/warning-alert"
import { CodeBlock } from "./code-block/code-block"

export const MDXWrapper = ({ content }: { content: string }) => (
	<MDXContent
		code={content}
		components={{
			code: InlineCode,
			pre: CodeBlock,
			ol: OrderedList,
			li: ListItem,
			strong: Strong,
			a: Anchor,
			InfoAlert,
			WarningAlert,
			// You can add any custom component here or override existing ones by following the MDX documentation: https://mdxjs.com/table-of-components/#components
		}}
	/>
)
