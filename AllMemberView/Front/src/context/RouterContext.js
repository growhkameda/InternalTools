import { createContext, useContext } from "react";
import { useDemoRouter } from "@toolpad/core/internal";

const RouterContext = createContext(null);

export const RouterProvider = ({ children }) => {
  const router = useDemoRouter("/home");
  return (
    <RouterContext.Provider value={router}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouterContext = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouterContext は RouterProvider 内で使用してください");
  }
  return context;
};