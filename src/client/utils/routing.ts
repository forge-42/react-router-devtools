import { EntryRoute } from "@remix-run/react/dist/routes.js";
import { RouteWildcards } from "../context/rdtReducer.js";
import { convertRemixPathToUrl, findParentErrorBoundary } from "./sanitize.js";

export type RouteType = "ROOT" | "LAYOUT" | "ROUTE";
type Route = Pick<EntryRoute, "id" | "index" | "path" | "parentId">;

export function getRouteType(route: Route) {
  if (route.id === "root") {
    return "ROOT";
  }
  if (route.index) {
    return "ROUTE";
  }
  if (!route.path) {
    // Pathless layout route
    return "LAYOUT";
  }

  // Find an index route with parentId set to this route
  const childIndexRoute = Object.values(window.__remixManifest.routes).find((r) => r.parentId === route.id && r.index);

  return childIndexRoute ? "LAYOUT" : "ROUTE";
}

export function isLayoutRoute(route: Route) {
  return getRouteType(route) === "LAYOUT";
}

export function isLeafRoute(route: Route) {
  return getRouteType(route) === "ROUTE";
}

export function isRootRoute(route: Route) {
  return getRouteType(route) === "ROOT";
}

export const ROUTE_FILLS = {
  GREEN: "fill-green-500 text-white",
  BLUE: "fill-blue-500 text-white",
  PURPLE: "fill-purple-500 text-white",
} as const;

export function getRouteColor(route: Route) {
  switch (getRouteType(route)) {
    case "ROOT":
      return ROUTE_FILLS["PURPLE"];
    case "LAYOUT":
      return ROUTE_FILLS["BLUE"];
    case "ROUTE":
      return ROUTE_FILLS["GREEN"];
  }
}
export type ExtendedRoute = EntryRoute & {
  url: string;
  errorBoundary: { hasErrorBoundary: boolean; errorBoundaryId: string | null };
};

export const constructRoutePath = (route: ExtendedRoute, routeWildcards: RouteWildcards) => {
  const hasWildcard = route.url.includes(":");
  const wildcards = routeWildcards[route.id];
  const path = route.url
    .split("/")
    .map((p) => {
      if (p.startsWith(":")) {
        return wildcards?.[p] ? wildcards?.[p] : p;
      }
      return p;
    })
    .join("/");
  const pathToOpen = document.location.origin + (path === "/" ? path : "/" + path);
  return { pathToOpen, path, hasWildcard };
};

export const createExtendedRoutes = () => {
  return Object.values(window.__remixManifest.routes)
    .map((route) => {
      return {
        ...route,
        url: convertRemixPathToUrl(window.__remixManifest.routes, route),
        errorBoundary: findParentErrorBoundary(window.__remixManifest.routes, route),
      };
    })
    .filter((route) => isLeafRoute(route));
};
