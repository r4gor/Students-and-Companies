import React, { useState } from "react";

// @ts-ignore
const EmailInput= ({setEmail}) => {
    const [isValid, setIsValid] = useState<boolean>(true);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Regex to validate email format
        const emailRegex = new RegExp("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$");
        let valid: boolean = emailRegex.test(inputValue)

        setIsValid(valid);

        if (valid){
            setEmail(inputValue);
        }
    };

    return (
        <div className="input-container" id="email">
            <div id="label">Institution Email</div>
            <input
                type="email"
                name="email"
                id="email"
                onChange={handleEmailChange}
            />
            {!isValid && (
                <div style={{ color: "red", marginTop: "5px" }}>
                    Please enter a valid email address.
                </div>
            )}
        </div>
    );
}

export default EmailInput;