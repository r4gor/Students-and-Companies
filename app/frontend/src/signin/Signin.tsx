import '../main.css'
import './signin.css'
import { useState } from 'react'; 

function Signin() {
		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		
    return (
        <>
				<div className='signin'>
					<div className="main-flex-container">
						<div className="central-container">
							<div id="title">
								<b>S&C</b> LOGIN
							</div>
							<div className="main-content-container">
								<div className="input-container" id="email">
									<div id="label">
										Email
									</div>
									<input type="email" name="email" id="email"
											value={email} onChange={e => {setEmail(e.target.value)}}
									/>
								</div>
								<div className="input-container" id="password">
									<div id="label">
										Password
									</div>
									<input type="password" name="password" id="password"
										value={password} onChange={e => setPassword(e.target.value)}
									/>
								</div>
								<div className="button-container">
									<button type="button" id="signup">Sign Up</button>
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
						console.log("login OK")
					}
				})
				.catch(err => {
					console.log(err)
				})
		}
}


export default Signin
