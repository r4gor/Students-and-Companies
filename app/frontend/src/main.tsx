import {StrictMode, useEffect} from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {AppStateProvider, useAppState} from './appstatecontext/AppStateContext';
import Signin from './signin/Signin';
import Home from './homepage/Home';
import Profile from './profile/Profile';
import SearchPage from './searchpage/SearchPage';
import InternshipManagement from './internshipmgmt/InternshipManagement';
import Signup from './signup/Signup';
import CreateInternship from './createinternship/CreateInternship';
import CandidatesHeader from './candidateselection/CandidatesHeader';
import CandidateSelection from './candidateselection/CandidateSelection';
import InterviewForm from './candidateselection/InterviewForm';
import ErrorPage from './errorpage/ErrorPage';
import EditProfile from "./editprofile/EditProfile.tsx";
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const {isAuthenticated, userEmail, userType, setUserType, setUserEmail, setIsAuthenticated} = useAppState();

    useEffect(() => {
        if (!isAuthenticated || !userEmail || !userType) {
            setIsAuthenticated(false);
            setUserEmail('');
            setUserType('');
        }
    }, [isAuthenticated, userEmail, userType]);


    if(isAuthenticated && userEmail && userType)
        return children;
    else {
        return <Navigate to="/" replace={true} />;
    }
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppStateProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    {/* Protected routes */}
                    <Route
                        path="/home"
                        element={<ProtectedRoute><Home /></ProtectedRoute>}
                    />
                    <Route
                        path="/edit_profile"
                        element={<ProtectedRoute><EditProfile /></ProtectedRoute>}
                    />
                    <Route
                        path="/profile"
                        element={<ProtectedRoute><Profile /></ProtectedRoute>}
                    />
                    <Route
                        path="/search_page"
                        element={<ProtectedRoute><SearchPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/create_internship"
                        element={<ProtectedRoute><CreateInternship /></ProtectedRoute>}
                    />
                    <Route
                        path="/candidates_selection/:internship_id"
                        element={<ProtectedRoute><CandidatesHeader /></ProtectedRoute>}>
                        <Route
                            index path=""
                            element={<ProtectedRoute><CandidateSelection /></ProtectedRoute>}
                        />
                        <Route
                            path="form/:candidate_email"
                            element={<ProtectedRoute><InterviewForm /></ProtectedRoute>} 
                        />
                    </Route>
                    <Route
                        path="/internship_management"
                        element={<ProtectedRoute><InternshipManagement /></ProtectedRoute>}
                    />
                    <Route path="*" element={<ErrorPage errorType={''} />} />
                </Routes>
            </BrowserRouter>
        </AppStateProvider>
    </StrictMode>,
);
