import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from './signin/Signin';
import Home from './homepage/Home';
import Profile from './profile/Profile';
import SearchPage from './searchpage/SearchPage';
import InternshipManagement from './internshipmgmt/InternshipManagement';
import Signup from './signup/Signup';
import CreateInternship from './createinternship/CreateInternship';
import ErrorPage from './errorpage/ErrorPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
                <Route path="/" element={<Signin/>}>

                </Route>
                <Route path="/index" element={<Home/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/search_page" element={<SearchPage/>} />
                <Route path="/create_internship" element={<CreateInternship/>} />
                <Route path="/internship_management" element={<InternshipManagement/>} />
                <Route path="*" element={<ErrorPage errorType={''}/>} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
);
