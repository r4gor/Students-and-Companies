import React, { useState } from "react";

// @ts-ignore
const EmailInput= ({setEmail}) => {
    const [localEmail, setLocalEmail] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setLocalEmail(inputValue);

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
                value={localEmail}
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