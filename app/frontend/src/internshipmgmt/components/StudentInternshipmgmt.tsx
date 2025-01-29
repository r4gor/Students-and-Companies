import { useEffect, useState } from "react";
import TopBarCentralText from "../../components/top_bar/top_bar_central_text.tsx";
import InternshipComponent from "./InternshipComponent";
import { useAppState } from "../../appstatecontext/AppStateContext";

type InternshipMgmtInfo = {
    id:string,
    title:string,
    status:string
}

function StudentInternshipmgmt() {
    const user_email = useAppState().userEmail as string
    const [internships, setInternships] = useState([] as InternshipMgmtInfo[])
    useEffect(() => {
		const fetch_internships = async () => {
			const response = await fetch_own_internships(user_email)
			const data = await response.json()
            console.log(data)
			setInternships(data)
		}
		fetch_internships()
	}, []);

    return (
        <>
        <div className="internship-mgmt student-internship-mgmt">
            <div className="main-flex-container">
                <TopBarCentralText text='Your internships'></TopBarCentralText>
                <div className="central-container">
                    <div className="box-background">
                        <div className="inner-box-section">
                            {
                                internships.length >= 1 &&
                                internships.map((internship, idx) => 
                                    (<InternshipComponent   id={internship.id}
                                                            title={internship.title} 
                                                            status={internship.status} 
                                                            position={idx} 
                                                            key={idx}>
                                    </InternshipComponent>
                                    ))
                            }
                            {
                                internships.length === 0 && (
                                    <div className="no-internships">Your internship list is empty!</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

function fetch_own_internships(user:string):Promise<Response> {
    let url = new URL('http://localhost:4000/api/internship_management/fetch_student_internships?user='+user)
    return fetch(url, { 
        method: "GET"
    });
}

export default StudentInternshipmgmt
