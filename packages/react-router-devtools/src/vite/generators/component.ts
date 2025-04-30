export const generateComponent = (withLoader = false) => {
	return [
		"export default function RouteComponent(){",
		...(withLoader ? ["  const data = useLoaderData<typeof loader>()"] : []),
		"  return (",
		"    <div />",
		"  );",
		"}",
	].join("\n")
}
