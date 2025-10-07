import { Layout } from "@/components/layout/Layaout";

import Dashboard from "@/modules/dashboard/Dashboard";
import { TeamsModule } from "@/modules/teams";
import TeamCreateModule from "@/modules/teams/create";

import TeamUpdateModule from "@/modules/teams/update";
import ErrorPage from "@/page/ErrorPage";
import Login from "@/page/login/Login";
import { createBrowserRouter, Navigate } from "react-router-dom";

export default function useRouterApp() {
  const isUserLoggedIn = Boolean(localStorage.getItem("token"));

  return createBrowserRouter([
    {
      path: "",
      element: isUserLoggedIn ? <Layout /> : <Navigate to="/login" />,
      errorElement: <ErrorPage />,
      children: isUserLoggedIn
        ? [
            {
              path: "/dashboard",
              element: <Dashboard />,
            },

            {
              path: "/teams",
              element: <TeamsModule />,
              errorElement: <ErrorPage />,
            },
            {
              path: "/teams-create",
              element: <TeamCreateModule />,
            },
            {
              path: "/teams/:id/edit",
              element: <TeamUpdateModule />,
            },
          ]
        : [],
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
  ]);
}
