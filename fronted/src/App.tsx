import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useRouterApp from "./router";
import { CookiesProvider } from "react-cookie";
import { RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();

export default function App() {
  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        {/* <Toaster richColors position="top-center" /> */}
        <RouterProvider router={useRouterApp()} />
      </QueryClientProvider>
    </CookiesProvider>
  );
}
