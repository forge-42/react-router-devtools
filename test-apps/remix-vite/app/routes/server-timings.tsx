import type { ActionFunctionArgs } from "@react-router/node";
import { json, redirect, type LoaderFunctionArgs,   } from "@react-router/node";
import type { MetaFunction } from "@react-router/node";

import { getServerTiming } from "~/timing.server";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export const loader = async ({ request, response }: LoaderFunctionArgs) => {
  const { time, getServerTimingHeader } = getServerTiming();
	await time("test", () => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve("test");
			}, 300);
		});
	})
	await time("test1", () =>new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve("test");
		}, 200);
	}))
  return json({ message: "Hello World!",   }, {
		headers: getServerTimingHeader(),
	});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return redirect("/login");
};

export default function Index() {

  return (
    <h1>
			Server timings test route
		</h1>
  );
}
