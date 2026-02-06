import { MetaFunction, LoaderFunctionArgs,   ActionFunctionArgs, useLoaderData, useFetcher, useSubmit, Link, data } from "react-router";



export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return data({
    should: "work",
    with: {
      nested: {
        objects: {
          really: {
            deep: "inside",
            array: [
              "this",
              "is",
              "a",
              "really",
              "long",
              "array",
              "that",
              "should",
              "be",
              "truncated",
            ],
          },
        },
      },
    },
  }, { headers: { "Set-Cookie": "test=1; Path=/; HttpOnly; Secure", "Cache-Control": "max-age=20"}});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return new Response(JSON.stringify({ test: "died" }));
};

export default function IndexRoute() {
  const string = useLoaderData<typeof loader>();
  const lFetcher = useFetcher();
  const lFetcher2 = useFetcher();
  const pFetcher = useFetcher();
  const submit = useSubmit();
  const data = new FormData();
  data.append("test", "test");
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix 5</h1>
      <button
        onClick={() =>
          lFetcher.submit(null, { method: "GET", action: "/tests/3/edit/new" })
        }
      >
        FETCHER Loader
      </button>{" "}
      <button
        onClick={() =>
          lFetcher2.submit(null, { method: "GET", action: "/tests/3/edit/new" })
        }
      >
        FETCHER 2 Loader
      </button>
      <button
        onClick={() =>
          pFetcher.submit(null, { method: "POST", action: "/tests/3/edit/new" })
        }
      >
        FETCHER Action
      </button>
      <button
        onClick={() => {
          submit(data, { method: "POST", action: "/tests/3/edit/new/5/5" });
        }}
      >
        SUBMIT Action test
      </button>
      <button
        onClick={() =>
          submit(data, { method: "PATCH", action: "/tests/3/edit/new" })
        }
      >
        SUBMIT Action PATCH
      </button>
      <button
        onClick={() =>
          submit(null, { method: "DELETE", action: "/tests/3/edit/new" })
        }
      >
        SUBMIT Action DELETE
      </button>
      <button
        onClick={() =>
          submit(null, { method: "PUT", action: "/tests/3/edit/new" })
        }
      >
        SUBMIT Action PUT
      </button>
      <Link to="/login">Login</Link>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
