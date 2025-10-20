import type { ComponentPropsWithoutRef } from "react"

/**
 * A styled wrapper around the native <code> element, used to display inline code snippets with consistent styling.
 *
 * Useful for rendering short code expressions, variable names, or commands within paragraphs or markdown content.
 *
 * Example usage:
 * <p>
 *   Install it using <InlineCode>npm install forge42/base-stack</InlineCode>.
 * </p>
 */
export const InlineCode = (props: ComponentPropsWithoutRef<"code">) => {
	return (
		<code
			{...props}
			className="mx-0 rounded bg-[var(--color-code-inline-bg)] px-2 py-1 text-[var(--color-code-inline-text)] text-sm md:text-base xl:mx-0.5 "
		/>
	)
}
