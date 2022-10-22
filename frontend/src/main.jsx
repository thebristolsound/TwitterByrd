import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  QueryClientProvider,
  QueryClient
} from '@tanstack/react-query'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './styles/index.css'
import Root from './routes/root'
import ErrorPage from './error-page'

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24 // 24 hours
    }
  }
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>
)
