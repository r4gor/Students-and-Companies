import '../main.css'
import './signin.css'
import { useState, ChangeEvent } from 'react'; 
// import  { redirect } from 'react-router-dom';
import { useNavigate } from "react-router";
import { useAppState } from '../appstatecontext/AppStateContext';
// const {userEmail, isAuthenticated, setUserEmail, setIsAuthenticated } = useAppState();

function Signin() {
		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		const [credentialsError, setCredentialsError] = useState('');

		let navigate = useNavigate();
		let appState = useAppState();

    	// Redirect to profile if authenticated
	    if (appState.isAuthenticated && appState.userEmail && appState.userType) {
	        navigate("/profile");
	    }
		
    return (
        <>
			<div className='signin'>
				<div className="main-flex-container">
					<div className="central-container">
						<div id="title">
							<b>S&C</b> LOGIN
						</div>
						<div className="main-content-container">
							{credentialsError !== '' && (<div className="error-container" id="signin-error"> 
								{credentialsError}	
							</div>)}
							<div className="input-container" id="email">
								<div id="label">
									Email
								</div>
								<input type="email" name="email" id="email"
									value={email} 
									onChange={(e: ChangeEvent<HTMLInputElement>) => {
										setEmail(e.target.value);
										setCredentialsError('');
									}}
								/>
							</div>
							<div className="input-container" id="password">
								<div id="label">
									Password
								</div>
								<input type="password" name="password" id="password"
									value={password} 
									onChange={(e: ChangeEvent<HTMLInputElement>) => {
										setPassword(e.target.value);
										setCredentialsError('');	
									}}
								/>
							</div>
							<div className="button-container">
								<button type="button" id="signup" onClick={() => navigate("/signup")}>Sign Up</button>
								<button type="button" id="login" onClick={() => handle_login()}>Log In</button>
							</div>
							
						</div>
					</div>
				</div>
			</div>
        </>
    )

	async function handle_login() {
		const data = {
			email: email,
			password: password
		};

		const options = {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(data) // Convert JSON data to a string and set it as the request body
		};
		
		await fetch("http://localhost:4000/api/sign_in", options)
		.then(response => {
			if(response.ok) { 
				appState.setUserEmail(email);
				appState.setIsAuthenticated(true);
				response.json().then((data) => appState.setUserType(data.user_type))
				navigate("/index"); 
			} 
			else { 
				response.json()
				.then((data) => {
					setCredentialsError(data.message)
				})
		 	}
		})
		.catch(console.error)
	}

	// function handle_signup() {
	// }
}


export default Signin
