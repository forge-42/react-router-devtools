import { motion } from "framer-motion"
import type React from "react"
import { useState } from "react"
import { Link, href } from "react-router"
import { cn } from "~/utils/css"

const transition = {
	type: "spring",
	mass: 0.5,
	damping: 11.5,
	stiffness: 100,
	restDelta: 0.001,
	restSpeed: 0.001,
}

const MenuItem = ({
	setActive,
	active,
	item,
	children,
}: {
	setActive: (item: string) => void
	active: string | null
	item: string
	children?: React.ReactNode
}) => {
	return (
		<div onMouseEnter={() => setActive(item)} className="relative ">
			<motion.p transition={{ duration: 0.3 }} className="cursor-pointer  text-white  hover:opacity-[0.9]">
				{item}
			</motion.p>
			{active !== null && (
				<motion.div
					initial={{ opacity: 0, scale: 0.85, y: 10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					transition={transition}
				>
					{active === item && (
						<div className="absolute left-1/2 top-[calc(100%_+_1rem)] -translate-x-1/2 transform">
							<motion.div
								transition={transition}
								layoutId="active" // layoutId ensures smooth animation
								className="overflow-hidden rounded-2xl border border-black/[0.2]  border-white/[0.2] bg-slate-950  shadow-xl  backdrop-blur-sm"
							>
								<motion.div
									layout // layout ensures smooth animation
									className="h-full w-max p-4"
								>
									{children}
								</motion.div>
							</motion.div>
						</div>
					)}
				</motion.div>
			)}
		</div>
	)
}

const Menu = ({
	setActive,
	children,
}: {
	setActive: (item: string | null) => void
	children: React.ReactNode
}) => {
	return (
		<nav
			onMouseLeave={() => setActive(null)} // resets the state
			className="shadow-input  relative flex justify-center space-x-4 rounded-full border border-transparent border-white/[0.2] bg-slate-950 px-8  py-4 dark:bg-slate-950 "
		>
			{children}
		</nav>
	)
}

const HoveredLink = ({ children, ...rest }: any) => {
	return (
		<Link {...rest} className="text-neutral-200 hover:text-slate-400 dark:text-neutral-200 ">
			{children}
		</Link>
	)
}

const ExternalLink = ({ url, text }: { url: string; text: string }) => {
	return (
		<a
			className="text-neutral-200 hover:text-slate-400 dark:text-neutral-200"
			target="_blank"
			href={url}
			rel="noreferrer"
		>
			{text}
		</a>
	)
}

export function Navbar({ className }: { className?: string }) {
	const [active, setActive] = useState<string | null>(null)
	return (
		<div className={cn("fixed inset-x-0 top-10 z-50 mx-auto max-w-2xl", className)}>
			<Menu setActive={setActive}>
				<MenuItem setActive={setActive} active={active} item="Documentation">
					<div className="flex flex-col space-y-4 text-sm">
						<HoveredLink to={href("/:version?/home")}>Getting started</HoveredLink>
						<HoveredLink
							to={href("/:version/:section?/:subsection?/:filename", {
								version: "current",
								section: "started",
								filename: "installation",
							})}
						>
							Installation
						</HoveredLink>
						<HoveredLink
							to={href("/:version/:section?/:subsection?/:filename", {
								version: "current",
								section: "configuration",
								filename: "client",
							})}
						>
							Client config
						</HoveredLink>
						<HoveredLink
							to={href("/:version/:section?/:subsection?/:filename", {
								version: "current",
								section: "configuration",
								filename: "server",
							})}
						>
							Server config
						</HoveredLink>
						<HoveredLink to="/docs/main/active-page-tab">Features</HoveredLink>
					</div>
				</MenuItem>
				<MenuItem setActive={setActive} active={active} item="Links">
					<div className="flex flex-col space-y-4 text-sm">
						<ExternalLink url="https://reactrouter.com/en/main" text="React Router" />
						<ExternalLink url="https://github.com/forge-42/react-router-devtools" text="Github" />
						<ExternalLink url="https://github.com/sponsors/AlemTuzlak" text="Sponsor" />
					</div>
				</MenuItem>
				<MenuItem setActive={setActive} active={active} item="Connect">
					<div className="flex flex-col space-y-4 text-sm">
						<ExternalLink url="https://twitter.com/AlemTuzlak" text="Twitter" />
						<ExternalLink url="https://github.com/AlemTuzlak" text="Github" />
						<ExternalLink url="https://www.youtube.com/channel/UCQVWDtZHhWTDEtr-7bAgKqg" text="YouTube" />
					</div>
				</MenuItem>
			</Menu>
		</div>
	)
}
