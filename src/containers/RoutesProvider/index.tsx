import { createContext, useContext } from "react";
import { RouteObject } from "react-router-dom";

type RoutesContextProps = {
  routes: RouteObject[]
}

const RoutesContext = createContext<RoutesContextProps>({ routes: [] });

/*
 * A tree traversal search of the routes tree.
 */
function findRoute(routes: RouteObject[], path: string) {
  const queue = [...routes];

  while (queue.length > 0) {
    const route = queue.shift();

    if (route?.path === path) {
      return route;
    }

    if (route?.children) {
      queue.push(...route.children);
    }
  }

  return null;
}

export const useRoutes = () => {
  const routesContext = useContext(RoutesContext);
  if (!routesContext) {
    throw new Error("useRoutes must be used within a RoutesProvider");
  }

  return routesContext.routes;
};

/*
 * Find a route by its path in the routes' tree
 */
export const useRoute = (path: string) => {
  const routes = useRoutes();

  return findRoute(routes, path);
};

type RoutesProviderProps = {
  children: JSX.Element
  routes: RouteObject[]
}


export const RoutesProvider = ({ children, routes }: RoutesProviderProps) => (
  <RoutesContext.Provider value={{ routes }}>{children}</RoutesContext.Provider>
);
