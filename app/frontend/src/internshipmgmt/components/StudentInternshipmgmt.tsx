import { useEffect, useState } from "react";
import TopBarCentralText from "../../components/top_bar/top_bar_central_text.tsx";
import InternshipComponent from "./InternshipComponent";
import { useAppState } from "../../appstatecontext/AppStateContext";

type InternshipMgmtInfo = {
    internship_id:string,
    title:string,
    status:string,
    internship_status:string
}

function StudentInternshipmgmt() {
    const user_email = useAppState().userEmail as string
    const [feedbacks, setFeedbacks] = useState(new Map<number, boolean>());
    const [internships, setInternships] = useState([] as InternshipMgmtInfo[])
    useEffect(() => {
		const fetch_internships = async () => {
			const response = await fetch_own_internships(user_email)
			const data = await response.json()
            console.log(data)
			setInternships(data)
		}
		fetch_internships()
		fetch_feedbacks_state();
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
                                    (<InternshipComponent   
                                        id={internship.internship_id}
                                        title={internship.title} 
                                        status={internship.status} 
                                        internship_status={ internship.internship_status }
                                        position={idx}
                                        feedbackSent={feedbacks.get(Number(internship.internship_id))} 
                                        key={idx}>
                                    </InternshipComponent>)
                                )
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

    async function fetch_feedbacks_state(): Promise<void> {
        let result: Map<number, boolean> = await fetch(`http://localhost:4000/api/feedbacks/fetch/state/${user_email}`)
        .then(res => {
            if(!res.ok) {
                console.dir(res);
                return new Map<number, boolean>();
            }
            return res
                .json()
                .then((data) => (
                    JSON.parse(data) as Array<{internship_id:number, sent:boolean}>)
                    .reduce((acc, row) => (acc.set(row.internship_id, row.sent)), new Map<number, boolean>)
                );
        }).catch(err => {
            console.error(err);
            return new Map<number, boolean>();
        });
        setFeedbacks(result);
    } 
}

function fetch_own_internships(user:string):Promise<Response> {
    let url = new URL('http://localhost:4000/api/internship_management/fetch_student_internships?user='+user)
    return fetch(url, { 
        method: "GET"
    });
}

export default StudentInternshipmgmt
