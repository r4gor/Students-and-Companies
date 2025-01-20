import '../main.css';
import './editprofile.css';
import {ChangeEvent, useEffect, useState} from "react";
import {useAppState} from '../appstatecontext/AppStateContext';
import {toBase64} from "../global_utils/fileToBase64.ts";

function EditProfile() {
    // Shared app state
    const { userEmail, userType} = useAppState();

    // State variables
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [cv, setCv] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [website, setWebsite] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');


    const handleProfileUpdate = async () => {
        let payload: Record<string, any> = {
            userEmail,
            userType,
        };

        if(phoneNumber.length > 14) {
            alert('Phone number too long');
            return;
        }

        if (userType === "student") {
            if (!firstName || !lastName || !phoneNumber || !dateOfBirth || !password || !repeatPassword) {
                alert("Please fill in all required fields!");
                return;
            }
            if(password !== repeatPassword) {
                alert("Passwords do not match!");
                return;
            }

            payload = {
                ...payload,
                firstName,
                lastName,
                phoneNumber,
                dateOfBirth,
                password
            };

            if (cv) {
                payload.cv = await toBase64(cv);
            }

        } else if (userType === "company" || userType === "university") {
            if (!name || !address || !phoneNumber || !website) {
                alert("Please fill in all required fields!");
                return;
            }
            if(password !== repeatPassword) {
                alert("Passwords do not match!");
                return;
            }

            payload = {
                ...payload,
                name,
                address,
                phoneNumber,
                website,
                password
            };
        }

        console.log(payload);

        const response = await fetch("http://localhost:4000/api/edit_profile/update_profile", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            alert(data.error);
        } else {
            alert("Profile updated successfully!");
            window.location.href = "/profile";
        }
    };

    //Populate edit_profile page on mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(
                    'http://localhost:4000/api/edit_profile/get_user_profile',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail }),
                    }
                );

                if (!response.ok) {
                    alert('Failed to fetch user profile');
                }

                let data = await response.json();
                console.log(data);
                if (data){
                    if(userType === "student"){
                        setFirstName(data[0].first_name || '');
                        setLastName(data[0].last_name || '');
                        setPhoneNumber(data[0].phone_number || '');
                        setDateOfBirth(data[0].date_of_birth || '');
                        setPassword(data[0].password);
                        setRepeatPassword(data[0].password);
                    }
                    else {
                        setName(data[0].name || '');
                        setAddress(data[0].address || '');
                        setWebsite(data[0].website || '');
                        setPhoneNumber(data[0].phone_number || '');
                        setPassword(data[0].password);
                        setRepeatPassword(data[0].password);
                    }
                }
                else
                    console.log("Error fetching user profile");
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);


    return (
        <div className='edit-profile'>
            <div className="main-flex-container">
                <div className="central-container">
                    <div id="title">
                        Edit Profile
                    </div>
                    <div className="main-content-container">
                        {userType === "student" && (
                            <>
                                <div className="input-container">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="input-container">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="input-container">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <div className="input-container">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDateOfBirth(e.target.value)}
                                    />
                                </div>
                                <div className="input-container">
                                    <label>Upload new CV (optional)</label>
                                    <input
                                        type="file"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCv(e.target.files?.[0] || null)}
                                    />
                                </div>
                            </>
                        )}

                        {(userType === "company" || userType === "university") && (
                            <>
                                <div className="input-container">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="input-container">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                                    />
                                </div>
                                <div className="input-container">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <div className="input-container">
                                    <label>Website</label>
                                    <input
                                        type="url"
                                        value={website}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <div className="input-container">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="input-container">
                            <label>Repeat Password</label>
                            <input
                                type="password"
                                value={repeatPassword}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
                            />
                        </div>

                        <div className="button-container">
                            <button type="button" onClick={handleProfileUpdate}>
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
