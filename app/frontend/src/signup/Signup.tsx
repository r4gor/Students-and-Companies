import '../main.css'
import './signup.css'
import Email_Input from "./utils/Email_Input.tsx";
import User_Type from "./utils/User_Type.tsx";
import {ChangeEvent, useState} from "react";
import { useAppState } from '../appstatecontext/AppStateContext';
import {Navigate} from "react-router-dom"; // Import the custom hook


function Signup () {
    // Shared app state
    const {isAuthenticated, userEmail, userType, setUserType, setUserEmail, setIsAuthenticated} = useAppState();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [university, setUniversity] = useState('');

    // Redirect to profile if authenticated
    if (isAuthenticated && userEmail && userType) {
        return <Navigate to="/profile" replace />;
    }


    const handleSignup = async () => {
        if (!userType) {
            alert("Select user type!");
            return;
        }
        if (userType === "student" && !university) {
            alert("Select university!");
            return;
        }
        if (!email) {
            alert("Please enter a valid email");
            return;
        }
        if (!password) {
            alert("Please enter your password!");
            return;
        }
        if (password !== repeatPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log({
            email,
            userType,
            university,
            password,
        });

        const response = await fetch("http://localhost:4000/api/sign_up/create_account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, userType, university, password}),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
        } else {
            setUserEmail(email);
            setIsAuthenticated(true);
            window.location.href = '/edit_profile';
        }
    };


    return (
        <>
            <div className='signup'>
                <div className="main-flex-container">
                    <div className="central-container">
                        <div id="title">
                            Welcome to <b>S&C</b>
                        </div>
                        <div className="main-content-container">

                            <User_Type setUserType={setUserType} setUniversity={setUniversity}/>

                            <Email_Input setEmail={setEmail}/>

                            <div className="input-container" id="password">
                                <div id="label">
                                    Password
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="input-container" id="rep-password">
                                <div id="label">
                                    Repeat Password
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    id="rep-password"
                                    value={repeatPassword}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
                                />
                            </div>
                            <div className="button-container">
                                <button
                                    type="button"
                                    id="signup"
                                    onClick={handleSignup}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup