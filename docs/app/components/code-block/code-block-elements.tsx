import type { ComponentPropsWithoutRef } from "react"
import { cn } from "~/utils/css"
import { createLineData } from "./code-block-parser"
import { getTokenColor, isTokenType, type tokenize } from "./code-block-syntax-highlighter"

const TokenElement = ({ token }: { token: ReturnType<typeof tokenize>[0] }) => {
	const { type, value } = token
	const color = isTokenType(type) ? getTokenColor(type) : ""

	return <span style={{ color }}>{value}</span>
}

const DiffIndicator = ({ indicator }: { indicator: string }) => (
	<span className="absolute top-0 left-0 w-4 select-none text-center font-medium text-[var(--color-diff-indicator)]">
		{indicator}
	</span>
)

const LineElement = ({ line }: { line: string }) => {
	const { tokens, styles, isNormalDiff } = createLineData(line)

	return (
		<div className="relative">
			<div
				className="flex min-h-[1.5rem] items-center pr-4 pl-4"
				style={{
					backgroundColor: styles.backgroundColor,
					borderLeft: styles.borderLeft,
					borderLeftColor: styles.borderLeftColor,
				}}
			>
				{!isNormalDiff && <DiffIndicator indicator={styles.indicator} />}
				<span className="block">
					{tokens.map((token, index) => (
						<TokenElement key={`${token.value}-${index}`} token={token} />
					))}
				</span>
			</div>
		</div>
	)
}

const CodeElement = ({ lines }: { lines: string[] }) => (
	<code className="relative block">
		{lines.map((line, index) => (
			<LineElement key={`${index}-${line}`} line={line} />
		))}
	</code>
)

interface PreElementProps extends Omit<ComponentPropsWithoutRef<"pre">, "children"> {
	lines: string[]
	className?: string
}

export const PreElement = ({ lines, className = "", ...props }: PreElementProps) => (
	<pre
		{...props}
		className={cn(
			"scrollbar scrollbar-thin relative overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-code-block-bg)] py-4 font-mono text-[var(--color-code-block-text)] text-xs leading-relaxed sm:text-sm md:text-base [&::-webkit-scrollbar-thumb:hover]:cursor-pointer",
			className
		)}
	>
		<CodeElement lines={lines} />
	</pre>
)
