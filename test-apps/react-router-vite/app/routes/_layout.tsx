import type { Route } from "./+types/_layout";
import { type LoaderFunctionArgs, Outlet } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return { test: "returning raw object" };
};

export const action = (args: Route.ActionArgs) => {

};

export default function App(args: Route.ComponentProps) {
  return (
    <div>
      <Outlet />
    </div>);

}