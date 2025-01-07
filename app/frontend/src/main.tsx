import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              {/*<Route path="/" element={<Layout />}>*/}
                  {/*<Route index element={<Home />} />*/}
                  {/*<Route path="profile" element={<Profile />} />*/}
                  {/*<Route path="" element={<Contact />} />*/}
                  {/*<Route path="*" element={<NoPage />} />*/}
              {/*</Route>*/}
          </Routes>
      </BrowserRouter>


  </StrictMode>,
)
