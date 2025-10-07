import type { ComponentProps } from "react"
import { Icon } from "~/ui/icon/icon"
import type { IconName } from "~/ui/icon/icons/types"
import { cn } from "~/utils/css"

interface IconLinkProps extends ComponentProps<"a"> {
	name: IconName
}

export const IconLink = ({ name, className, ...props }: IconLinkProps) => {
	const { href } = props
	const isExternal = typeof href === "string" && /^https?:\/\//i.test(href)
	return (
		<a
			className={cn(
				"group relative inline-flex cursor-pointer items-center justify-center rounded-full text-[var(--color-text-active)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border)] focus-visible:ring-offset-2",
				className
			)}
			target={isExternal ? "_blank" : undefined}
			rel="noopener noreferrer"
			aria-label={name}
			href={href}
			{...props}
		>
			<Icon name={name} className="size-4 transition-all duration-300 xl:size-5" />
		</a>
	)
}
