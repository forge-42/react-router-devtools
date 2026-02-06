
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
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
  return new Response(
    JSON.stringify({
      test: "JSON stringify with new response and a long ass string to test something",
    })
  );
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
      <h1>Welcome to Remix 2</h1>

      <Outlet />

    </div>
  );
}
