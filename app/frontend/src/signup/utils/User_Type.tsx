import React, {ChangeEvent, useState} from "react";

// interface User_TypeProps {
//     setUserType?: React.Dispatch<React.SetStateAction<string>>;
//     setUniversity?: React.Dispatch<React.SetStateAction<string>>;
// }

// @ts-ignore
const User_Type = ({ setUserType, setUniversity}) => {
    const [localUserType, setLocalUserType] = useState("");
    const [localUniversities, setLocalUniversities] = useState([]);

    const fetchStudentOptions = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/sign_up/get_universities");
            const data = await response.json();
            setLocalUniversities(JSON.parse(data));
        } catch (error) {
            console.error("Error fetching student options:", error);
        }
    };

    const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType: string = e.target.value;
        setLocalUserType(selectedType);
        setUserType(selectedType);

        if (selectedType === "student") {
            fetchStudentOptions();
        }
    }

    return (
        <>
            <div className="input-container" id="user-type">
                <div id="label">
                    What type of user are you?
                </div>
                <select name="type" id="type" onChange={handleUserTypeChange}>
                    <option></option>
                    <option value="company">Company</option>
                    <option value="university">University</option>
                    <option value="student">Student</option>
                </select>
            </div>

            {/*Render second select box if "Student" is selected*/}
            {localUserType === "student" && (
                <div className="input-container" id="university">
                    <div id="label">Select university:</div>
                    <select
                        name="studentOption"
                        id="university"
                        onChange ={(e:ChangeEvent<HTMLSelectElement>) => {setUniversity(e.target.value)}}
                    >
                        <option></option>
                        {
                            Array.isArray(localUniversities) &&
                            localUniversities.map((option: { user_email: string, name: string }) =>
                                (
                                    <option key={option.user_email} value={option.user_email}>
                                        {option.name}
                                    </option>
                                )
                            )
                        }
                    </select>
                </div>
            )}
        </>
    );
}

export default User_Type;