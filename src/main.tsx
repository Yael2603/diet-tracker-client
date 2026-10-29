import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import type { ApiError } from "./types/common";
import route from "./router.tsx"

const handleAuthError = (error: unknown) => {
  const isUnauthorized = (error as ApiError).status === 401;
  const hasToken = localStorage.getItem("token") !== null;
  const onLoginPage = window.location.pathname === "/login";
  if (isUnauthorized && hasToken && !onLoginPage) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleAuthError }),
  mutationCache: new MutationCache({ onError: handleAuthError }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={route}/>
    </QueryClientProvider>
  </StrictMode>,
)

