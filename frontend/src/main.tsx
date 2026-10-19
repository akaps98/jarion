import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router/router.tsx'
import { RouterProvider } from 'react-router-dom'

// Router 사용하여 렌더링하게끔 변경
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
