import {
  type ActionFunctionArgs,
  data,
  Form,
  Links,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { userSomething } from "./modules/user.server";
import { EmbeddedDevTools } from "../../../packages/react-router-devtools/dist/client"

// Server middleware
const authMiddleware = async (args: any, next: () => Promise<Response>) => {
  console.log("Auth middleware - checking authentication");
  return next();
}

const loggingMiddleware = async (args: any, next: () => Promise<Response>) => {
  console.log("Logging middleware - request:", args.request.url);
  const response = await next();
  console.log("Logging middleware - response status:", response.status);
  return response;
}

export const middleware = [authMiddleware, loggingMiddleware];

// Client middleware
const clientAuthMiddleware = async (args: any, next: () => Promise<Response>) => {
  console.log("Client auth middleware - checking client-side authentication");
  return next();
}

const clientLoggingMiddleware = async (args: any, next: () => Promise<Response>) => {
  console.log("Client logging middleware - request:", args.request.url);
  const response = await next();
  console.log("Client logging middleware - response status:", response.status);
  return response;
}

export const clientMiddleware = [
  clientAuthMiddleware,
  clientLoggingMiddleware,
];

export const links = () => [];

export const loader = ({context, devTools }: LoaderFunctionArgs) => {
  userSomething();
  const mainPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const subPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("test");
        }, 2000);
      });
      resolve({ test: "test", subPromise});
    }, 2000);
  });
  console.log("loader called");
  const end =devTools?.tracing.start("test")!;
  end();
  return  data({ message: "Hello World", mainPromise, bigInt: BigInt(10) },  );
}

export const action =async  ({devTools}: ActionFunctionArgs) => {
  const end = devTools?.tracing.start("action submission")
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("test");
    }, 2000);
  });
  end?.();
  console.log("action called");
  return  ({ message: "Hello World", bigInt: BigInt(10) });
}

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
       <Form method="post">
        <input readOnly type="text" name="name" value={"name"} />
       <button type="submit">
          Submit
        </button>
       </Form>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
    <EmbeddedDevTools />
      </body>
    </html>
  );
}

export { App as default }