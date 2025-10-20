import type { ReactNode } from "react"
import { href, useNavigate } from "react-router"

export const Logo = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate()
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: we don't need keyboard access for this
		<div
			onClick={() => navigate(href("/:version?/home"))}
			className="relative block cursor-pointer font-semibold font-space text-[var(--color-text-active)] text-lg md:text-2xl xl:text-3xl"
		>
			{children}
		</div>
	)
}
