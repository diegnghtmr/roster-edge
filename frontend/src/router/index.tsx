import { Layout } from "@/components/layout/Layaout";

import Dashboard from "@/modules/dashboard/Dashboard";
import TeamsModule from "@/modules/teams";
import ErrorPage from "@/page/ErrorPage";
import Login from "@/page/login/Login";
import { createBrowserRouter } from "react-router-dom";

export default function useRouterApp() {
  return createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "/teams",
          element: <TeamsModule />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
  ]);
}
