export const generateErrorBoundary = () => {
	return [
		"export function ErrorBoundary(){",
		"  const error = useRouteError();",
		"  if (isRouteErrorResponse(error)) {",
		"    return <div/>",
		"  }",
		"  return <div/>",
		"}",
	].join("\n")
}
