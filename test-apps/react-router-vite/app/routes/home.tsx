
import { useLoaderData } from "react-router";
import { loader } from "../actions/home";
export { loader };

export function meta(  ) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}



export default function Home() {
  const { message } = useLoaderData<typeof loader>();
  return <div />;
}