import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from './signin/Signin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Signin/>} />
              {/* <Route exact path={"/index"} component={Home} />
              <Route exact path={"/profile"} component={Profile} />
              <Route exact path={"/search_page"} component={SearchPage} />
              <Route exact path={"/internship_management"} component={InternshipManagement} />
              <Route exact path={"/complaints_management"} component={ComplaintsManagement} /> */}
          </Routes>
      </BrowserRouter>
  </StrictMode>,
);
