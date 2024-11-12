
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

export const loader =   ({ request }: LoaderFunctionArgs) => {
  return  { test: "died" }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return  ({
    test: "died",
  });
};

export default function Index() {
  const data = new FormData();
  data.append("test", "test");
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <p>
        <p>

        </p>
      </p>
      <Outlet />
    </div>
  );
}
