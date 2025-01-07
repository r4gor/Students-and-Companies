function Signin ()  {
    return (
        <>
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
						<input type="email" name="email" id="email" />
					</div>
					<div className="input-container" id="password">
						<div id="label">
							Password
						</div>
						<input type="password" name="password" id="password" />
					</div>
					<div className="button-container">
						<button type="button" id="signup">Sign Up</button>
						<button type="button" id="login">Log In</button>
					</div>
					<div className="forgot-password-container">
						<a href="http://" target="_blank" rel="noopener noreferrer">Forgot password?</a>
					</div>
				</div>
				
			</div>
    </div>
        </>
    )
}

export default Signin