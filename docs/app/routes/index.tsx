import { Link, href } from "react-router"
import { FeaturesSection } from "~/components/FeaturesSection"
import { Button } from "~/components/ui/Button"
import { LampContainer } from "~/components/ui/Lamp"
import { MaskContainer } from "~/components/ui/MaskContainer"
import { Meteors } from "~/components/ui/Meteors"
import { InfiniteMovingCards } from "~/components/ui/infinite-cards"
import { Navbar } from "~/components/ui/navbar-menu"
import { TypewriterEffect } from "~/components/ui/typewritter"
import { Route } from "./+types"
import { buildDocPathFromSlug } from "~/utils/path-builders"
import { generateMetaFields } from "~/utils/seo"
import { getDomain } from "~/utils/get-domain"

export const meta = ({ data }: Route.MetaArgs) => {
	const { domain } = data
	return generateMetaFields({
		domain,
		path: "/",
		title: "React Router Devtools",
		description:
			"Get up and running with React Router Devtools in a React Router 7+ project using Vite and ESM.",
	})
}

export async function loader({ request }: Route.LoaderArgs) {
	const { domain } = getDomain(request)
	return { domain }
}

export default function Index() {
	return (
		<div className="placeholder-index relative h-full min-h-screen w-screen overflow-x-hidden bg-slate-950">
			<Navbar />
			<div className="fixed top-0 z-30">
				<Meteors />
			</div>

			<LampContainer className="h-[100vh]">
				<h1 className="text-center text-4xl font-bold !leading-normal text-white md:text-5xl xl:text-7xl">
					Own <br /> your <span className="mr-4 text-green-500"> React Router</span>
					application
				</h1>
			</LampContainer>
			<FeaturesSection />
			<OpenSourceReveal />
			<div className="mb-40 flex w-full items-center justify-center">
				<InfiniteMovingCards
					speed="normal"
					className="w-full"
					items={[
						{
							title: "Raphaël Moreau",
							name: "Software Engineer",
							quote:
								"React Router Devtools are really helpful when I struggle with something that doesn’t work as I expect. You have everything you need to debug right in your browser (really helpful when I can’t use a second monitor). The features I can’t work without are the active page data with the loader/action data and the server responses (no need to search for a console.log in the terminal or the browser console) and the error tab with the hydration mismatch view 🔥. (I love everything but it would be suspicious if I listed it all)",
						},
						{
							title: "Alem Tuzlak",
							name: "The guy who created this",
							quote:
								"React Router Devtools is the best tool I have created so far. You should definitely try it out in your React Router project and this is not a paid testimonial 😂",
						},
						{
							title: "xHomu",
							name: "Software Engineer",
							quote:
								"From hydration error to hunting down nested routes, with RDT, the solution to the worst React Router pain points is always just a click away. Don't build a React Router app without it! ",
						},
					]}
				/>
			</div>
			<div className="flex min-h-[20vh] w-full flex-col items-center gap-12 overflow-x-hidden pb-20">
				<TypewriterEffect
					words={"Want to get started? Click the button below!"
						.split(" ")
						.map((word) => ({ text: word, className: "!text-white" }))}
				/>
				<Button as={Link} to={href("/:version?/home")} className="text-white" viewTransition>
					Get Started
				</Button>
			</div>
		</div>
	)
}

export function OpenSourceReveal() {
	return (
		<div className="flex h-[40rem] w-full items-center justify-center overflow-hidden bg-slate-950">
			<MaskContainer
				revealText={
					<p className="mx-auto flex max-w-4xl flex-col gap-2 text-center text-3xl font-bold text-slate-500">
						<span>Want to open up an element directly in your editor? 🚀</span>

						<span>You're one hover away from learning how!</span>
					</p>
				}
				className="h-[40rem]"
			>
				Click <span className="text-red-500">Shift + Right Click</span> to directly go to element source in
				<span className="ml-2 text-blue-500">VS Code</span> 🔥
			</MaskContainer>
		</div>
	)
}
