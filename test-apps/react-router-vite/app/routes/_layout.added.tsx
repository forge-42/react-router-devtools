import type { Route } from "./+types/_layout.added";
export default function RouteComponent({loaderData}: Route.ComponentProps) {
  return <div />;
}

export const loader = (args: Route.LoaderArgs) => {

};

export const action = (args: Route.ActionArgs) => {};

export const middleware: Route.MiddlewareFunction[] = [];

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [];