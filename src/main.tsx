import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import route from "./router.tsx"

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={route}/>
    </QueryClientProvider>
  </StrictMode>,
)


