export const generateDependencies = (selectedGenerators: string[], shouldIncludeLoaderData = true) => {
	const actionImports = ""
	const loaderImports = ""
	const reactRouterDeps = []
	const typeDeps = []

	if (selectedGenerators.includes("meta")) {
		typeDeps.push("MetaFunction")
	}
	if (selectedGenerators.includes("headers")) {
		typeDeps.push("HeadersFunction")
	}
	if (selectedGenerators.includes("links")) {
		typeDeps.push("LinksFunction")
	}
	if (selectedGenerators.includes("loader")) {
		typeDeps.push("LoaderFunctionArgs")
		if (shouldIncludeLoaderData) {
			reactRouterDeps.push("useLoaderData")
		}
	}
	if (selectedGenerators.includes("clientLoader")) {
		typeDeps.push("ClientLoaderFunctionArgs")
	}
	if (selectedGenerators.includes("clientAction")) {
		typeDeps.push("ClientActionFunctionArgs")
	}
	if (selectedGenerators.includes("action")) {
		typeDeps.push("ActionFunctionArgs")
	}
	if (selectedGenerators.includes("revalidate")) {
		typeDeps.push("ShouldRevalidateFunction")
	}
	if (selectedGenerators.includes("errorBoundary")) {
		reactRouterDeps.push("isRouteErrorResponse", "useRouteError")
	}

	const output: string[] = [
		...(actionImports && selectedGenerators.includes("action") ? [actionImports] : []),
		...(loaderImports && selectedGenerators.includes("loader") ? [loaderImports] : []),
	]

	if (typeDeps.length) {
		output.push(`import type { ${typeDeps.join(", ")} } from "react-router";`)
	}
	if (reactRouterDeps.length) {
		output.push(`import { ${reactRouterDeps.join(", ")} } from "react-router";`)
	}

	return output.join("\n")
}
