import   { LoaderFunctionArgs, ClientLoaderFunctionArgs, ClientActionFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, isRouteErrorResponse, useRouteError } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return null;
};

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  return null;
};

export default function RouteComponent(){
  const data = useLoaderData<typeof loader>()
  return (
    <div />
  );
}

export function ErrorBoundary(){
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <div/>
  }
  return <div/>
}