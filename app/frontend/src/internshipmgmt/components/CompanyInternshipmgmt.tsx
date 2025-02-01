import { useEffect, useState } from "react";
import TopBarCentralText from "../../components/top_bar/top_bar_central_text.tsx";
import InternshipComponentExtended from "./InternshipComponentExtended";
import { useAppState } from "../../appstatecontext/AppStateContext";
import { InternshipInformation } from "../../searchpage/utils/internship_information";

function CompanyInternshipmgmt() {
    const user_email = useAppState().userEmail as string
    const [feedbacks, setFeedbacks] = useState(new Map<number, boolean>());
    const [internships, setInternships] = useState([] as InternshipInformation[])
    useEffect(() => {
		const fetch_internships = async () => {
			const response = await fetch_company_internships(user_email)
			const data = await response.json()
			setInternships(data.map((row:any) => new InternshipInformation(row)))
		}
		fetch_internships()
		fetch_feedbacks_state();
	}, []);

    return (
        <>
        <div className="internship-mgmt student-internship-mgmt">
            <div className="main-flex-container">
                <TopBarCentralText text='Internships management'></TopBarCentralText>
                <div className="central-container">
                    <div className="box-background">
                        <div className="inner-box-section">
                            {
                                internships.length >= 1 &&
                                (<div className="new-internship-container">
                                    <a href={'/create_internship'}><button type="button" className="std-button">Create new internship</button></a>
                                </div>)
                            } 
                            {   internships.length >=1 &&
                                internships.map((info, idx) =>
                                    (<InternshipComponentExtended 
                                        key={idx} 
                                        info={info}
                                        feedbackSent={feedbacks.get(info.id)} 
                                        position={idx}></InternshipComponentExtended>
                                    ))
                            }
                            {
                                internships.length === 0 && (
                                    <div className="no-internships">
                                        <div id="content">Your internship list is empty!</div>
                                        <a href={'/create_internship'}><button type="button" className="std-button">Create new internship</button></a>
                                    </div>
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

function fetch_company_internships(user: string): Promise<Response> {
    let url = new URL('http://localhost:4000/api/internship_management/fetch_company_internships?user='+user)
    return fetch(url, { 
        method: "GET"
    });
}

export default CompanyInternshipmgmt
