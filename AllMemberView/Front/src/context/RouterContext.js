import { createContext, useContext, useEffect } from "react";
import { useDemoRouter } from "@toolpad/core/internal";

const RouterContext = createContext(null);
const STORAGE_KEY = "toolpad_pathname";

export const RouterProvider = ({ children }) => {
  const initialPath = sessionStorage.getItem(STORAGE_KEY) || "/home";
  const router = useDemoRouter(initialPath);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, router.pathname);
  }, [router.pathname]);

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