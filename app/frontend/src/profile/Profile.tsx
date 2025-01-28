import '../main.css'
import './profile.css'
import {useAppState} from "../appstatecontext/AppStateContext.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import TopBarCentralText from "../components/top_bar/top_bar_central_text.tsx";

function Profile ()  {

    const {userEmail, userType, setIsAuthenticated} = useAppState();

    const { reqEmail } = useParams<{ reqEmail?: string }>();

    const [address, setAddress] = useState();
    // const [cv, setCv] = useState();
    const [dateOfBirth, setDateOfBirth] = useState("");
    // const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [name, setName] = useState();
    // const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [universityEmail, setUniversityEmail] = useState("");
    const [profileUserEmail, setProfileUserEmail] = useState();
    const [profileUserType, setProfileUserType] = useState("");
    const [website, setWebsite] = useState();

    const [tags, setTags] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [newTag, setNewTag] = useState<string>('');

    const [companyInternships, setCompanyInternships] = useState<[]>([]);
    const [showInvitePopup, setShowInvitePopup] = useState<boolean>(false);
    const [selectedInternship, setSelectedInternship] = useState<number>();

    const fetchUserProfile = async () => {
        try {
            const emailToFetch = reqEmail || userEmail;

            const response = await fetch(
                'http://localhost:4000/api/profile/get_user_profile',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userEmail: emailToFetch }),
                }
            );

            if (!response.ok) {
                alert('Failed to fetch user profile');
                setIsAuthenticated(false);
                return;
            }

            const data = await response.json();
            console.log(data);

            // If the requested email is not empty but the profile doesn't exist
            if (reqEmail && (!data || !data[0]?.email)) {
                alert('The requested profile does not exist.');
                window.location.href = '/profile';
                return;
            }

            // Populate state with profile data
            if (data && data[0]) {
                setAddress(data[0].address || '');
                // setCv(data[0].cv || '');
                setDateOfBirth(data[0].date_of_birth || '');
                setFirstName(data[0].first_name || '');
                setLastName(data[0].last_name || '');
                setName(data[0].name || '');
                setPhoneNumber(data[0].phone_number || '');
                setUniversityEmail(data[0].university_email || '');
                setProfileUserEmail(data[0].email || '');
                setProfileUserType(data[0].user_type || '');
                setWebsite(data[0].website || '');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setIsAuthenticated(false);
        }
    };

    const fetchUserTags = async () => {
        if(profileUserEmail)
            try {
                const response = await fetch(
                    'http://localhost:4000/api/profile/get_user_tags',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userEmail: profileUserEmail }),
                    }
                );

                if (!response.ok) {
                    alert('Failed to fetch tags for this profile');
                    return;
                }

                let tags = await response.json();
                setTags(tags);
                console.log(tags);

            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
    };

    const downloadUserCv = async () => {
        try {
            const response = await fetch(
                'http://localhost:4000/api/profile/get_cv',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userEmail: profileUserEmail}),
                }
            );

            if (!response.ok) {
                alert('Failed to fetch cv for this profile');
                return;
            }

            const data = await response.json();
            if(!data || Object.keys(data).length === 0)
                return;

            // Decode Base64 and create a Blob
            const byteCharacters = atob(data.base64);
            const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: data.mimeType });

            // Create a URL for the Blob and open it in a new tab
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error fetching or opening CV:', error);
        }

    };

    const inviteStudent = async () => {
        if(selectedInternship) {
            const response = await fetch(
                'http://localhost:4000/api/profile/invite_student',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        companyEmail: userEmail,
                        internshipId: selectedInternship,
                        studentEmail: profileUserEmail
                    }),
                }
            );

            if (!response.ok) {
                alert('Failed to fetch cv for this profile');
                return;
            }
            setShowInvitePopup(false)
            alert(await response.json());

        }
    };

    const fetchCompanyInternships = async () => {
        if(userEmail && userType === 'c') {
            const response = await fetch(
                'http://localhost:4000/api/profile/get_company_internships',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userEmail: userEmail}),
                }
            );

            if (!response.ok) {
                alert('Failed to fetch internships for this company');
                return;
            }

            let data = await response.json();
            console.log(data);
            if(!data || Object.keys(data).length === 0)
                return;

            setCompanyInternships(data);

        }
    }

    const handleAddTag = async () => {
        if (newTag.trim() !== '') {
            const response = await fetch(
                'http://localhost:4000/api/profile/add_tag_to_user',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userEmail: profileUserEmail, tag: newTag.trim()}),
                }
            );

            if (!response.ok) {
                alert('Failed to fetch tags for this profile');
                return;
            }
            setNewTag('');
            setTags(await response.json());
        }
        setShowPopup(false); // Close the popup after adding the tag
    };

    const handleDeleteTag = async (tag: string) => {
        const response = await fetch(
            'http://localhost:4000/api/profile/remove_tag_from_user',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userEmail: profileUserEmail, tag: tag}),
            }
        );

        if (!response.ok) {
            alert('Failed to delete tag for this profile');
            return;
        }

        setTags(await response.json());
    }



    //Populate profile page on mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        fetchUserTags();
    }, [profileUserEmail, setTags]);


    return (
        <>
            <div className="profile">
                <TopBarCentralText text={'Profile'}></TopBarCentralText>
                <div className="central-container">
                    <div className="box-background">
                        <div className="inner-box-section top-inner-box-section">
                            <div id="name">{profileUserType === "s" ? firstName + ' ' + lastName : name}</div>
                            {universityEmail ? (
                                <>
                                    <a href={"/profile/" + universityEmail} target="_blank" id="type">
                                        <i className="material-icons">school</i>
                                        University: {universityEmail}
                                    </a>
                                </>
                            ) : (
                                <>
                                    <a href={'https://' + website} target="_blank" id="type">
                                        <i className="material-icons">language</i>
                                        {website}
                                    </a>
                                </>
                            )}

                            <div id="tags">
                                {tags && tags.length > 0 ? (
                                    tags.map((tag, index) => (
                                        <div className="tag" key={index}>
                                            {tag}

                                            {userEmail === profileUserEmail ? (
                                                <span
                                                className="delete-tag"
                                                onClick={() => handleDeleteTag(tag)}
                                                style={{
                                                    marginLeft: '5px',
                                                    color: 'red',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}>x</span>
                                            ) : null}
                                        </div>
                                    ))
                                ) : null}

                                {userEmail === profileUserEmail ? (
                                    <>
                                        <div onClick={() => setShowPopup(true)} className="tag add-tag">+ Add TAG</div>
                                    </>
                                ) : null}
                            </div>

                            {showPopup && (
                                <div className="popup">
                                    <div className="popup-content">
                                        <h3>Add a New Tag</h3>
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="Enter a tag"
                                        />
                                        <button onClick={handleAddTag}>Add</button>
                                        <button onClick={() => setShowPopup(false)}>Cancel</button>
                                    </div>
                                </div>
                            )}


                            <div id="description">
                            {profileUserType === 'c' || profileUserType === 'u' ? (
                                    <>
                                        {profileUserType === 'c' ? (
                                            <>
                                                COMPANY<br/>
                                            </>
                                        ) : (
                                            <>
                                                UNIVERSITY<br/>
                                            </>
                                        )}
                                        Address: {address}<br/>
                                    </>
                                ) : (
                                    <>
                                        STUDENT<br/>
                                        Birthdate: {dateOfBirth}<br/>
                                    </>
                                )}
                            </div>

                            <div className="button-container">
                                {profileUserType === 's' ? (
                                    <>
                                        <button type="button" className="std-button" id="cv"
                                                onClick={() =>
                                                    downloadUserCv()}>
                                            Download CV
                                        </button>
                                    </>
                                ) : null}


                                {userType === "c" && profileUserType === 's' ? (
                                    <>
                                        <button type="button" className="std-button" id="invite"
                                                onClick={async () => {
                                                    await fetchCompanyInternships();
                                                    setShowInvitePopup(true)
                                                }}>
                                            Invite
                                        </button>
                                    </>
                                ) : null}

                                {showInvitePopup && (
                                    <div className="popup">
                                        <div className="popup-content">
                                            <h3>Invite student to apply to internship</h3>
                                            <select
                                                onChange ={(e:ChangeEvent<HTMLSelectElement>) => {
                                                    setSelectedInternship(parseInt(e.target.value))}
                                                }
                                            >
                                                <option>Select internship</option>
                                                {
                                                    Array.isArray(companyInternships) &&
                                                    companyInternships.map((option:{id: number, title: string}) =>
                                                        (
                                                            <option key={option.id} value={option.id}>
                                                                {option.title}
                                                            </option>
                                                        )
                                                    )
                                                }
                                            </select>

                                            <button onClick={inviteStudent}>Add</button>
                                            <button onClick={() => setShowInvitePopup(false)}>Cancel</button>
                                        </div>
                                    </div>
                                )}


                                {userEmail === profileUserEmail ? (
                                    <>
                                        <a href={'/edit_profile'}>
                                            <button type="button" className="std-button" id="edit_profile">
                                                Edit Profile
                                            </button>
                                        </a>
                                    </>
                                ) : null}
                            </div>

                        </div>
                        <div className="inner-box-section" id="contact">
                        <div className="box-description">
                                Contact
                            </div>
                            Phone: {phoneNumber}<br/>
                            Email: {profileUserEmail}<br/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile