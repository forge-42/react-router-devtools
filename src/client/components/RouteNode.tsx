import clsx from "clsx";
import { RouteWildcards } from "../context/rdtReducer.js";
import { ExtendedRoute, getRouteColor } from "../utils/routing.js";
import type { CustomNodeElementProps } from "react-d3-tree";
import type { useNavigate } from "@remix-run/react";

export const RouteNode = ({
  nodeDatum,
  hierarchyPointNode,
  toggleNode,
  setActiveRoute,
  activeRoutes,
  navigate
}: CustomNodeElementProps & {
  routeWildcards: RouteWildcards;
  setActiveRoute: (e: ExtendedRoute) => void;
  activeRoutes: string[];
  navigate: ReturnType<typeof useNavigate>;
}) => {
   
  const parent = hierarchyPointNode.parent?.data;
  const parentName = parent && parent?.name !== "/" ? parent.name : "";
  const name = nodeDatum.name.replace(parentName, "") ?? "/";
  const route = { ...nodeDatum, ...nodeDatum.attributes } as any as ExtendedRoute;
  return (
    <g  className="flex">
      <circle
        x={20}
        onClick={toggleNode} 
        className={clsx(
          getRouteColor(route),
          "stroke-white",
          nodeDatum.__rd3t.collapsed && nodeDatum.children?.length && "fill-gray-800"
        )}
        r={12}
      ></circle>
      <g >
        <foreignObject   y={-15} x={17} width={110} height={140}>
          <p
            onClick={() => setActiveRoute(route)}
            onDoubleClickCapture={() => {
              navigate(route.url)
            }}
            style={{ width: 100, fontSize: 14 }}
            className={clsx(
              "w-full break-all fill-white stroke-transparent",
              activeRoutes.includes(route.id) && "text-yellow-500"
            )}
          >
            {nodeDatum.attributes?.id === "root" ? "Root" : name ? name : "Index"}
          </p>
        </foreignObject>
      </g>
    </g>
  );
};
