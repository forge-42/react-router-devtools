
import {
  ActionFunctionArgs,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  Outlet,
  useFetcher,
  useLoaderData,
  useSubmit,
} from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return new Response(new URLSearchParams("test=1&test=2&test=3"));
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return  ({
    test: "died",
  });
};

export default function Index() {
  const { message } = useLoaderData<typeof loader>();
  const lFetcher = useFetcher();
  const pFetcher = useFetcher();
  const submit = useSubmit();
  const data = new FormData();
  data.append("test", "test");
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <Outlet />
    </div>
  );
}
