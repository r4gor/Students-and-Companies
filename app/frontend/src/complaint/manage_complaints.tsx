import { useEffect, useState } from "react"
import { useAppState } from "../appstatecontext/AppStateContext"
import TopBarCentralText from "../components/top_bar/top_bar_central_text"
import './manage_complaints.css'

type ComplaintInfo = {
    id:string,
    user_email:string,
    internship_id:string,
    description:string,
    recipient:string
}

function ManageComplaints() {
    const [complaints, setComplaints] = useState([] as ComplaintInfo[])
    const user_email = useAppState().userEmail as string
    const fetch_complaints = async () => {
        const response = await fetch_own_complaints(user_email)
        const data = await response.json()
        setComplaints(data)
    }
    useEffect(() => {
		fetch_complaints()
	}, []);
    return (
        <>
        <div className="manage-complaints">
            <div className="main-flex-container">
                <TopBarCentralText text='Manage complaints'></TopBarCentralText>
                <div className="central-container">
                    <div className="box-background">
                        <div className="inner-box-section">
                            {complaints.map((complaint,idx) => 
                                (<Complaint complaintinfo={complaint} position={idx} key={complaint.id}></Complaint>))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

function Complaint({complaintinfo, position}:{complaintinfo:ComplaintInfo, position:number}) {
    return(
        <>
        <div className={"complaint"+(position%2 == 0 ? '':' odd')}>
                <div id="complaint-id">Complaint no.{complaintinfo.id}</div>
                <div id="from">From: {complaintinfo.user_email}</div>
                <div id="to">To: {complaintinfo.recipient}</div>
            <div id="label">Description:</div>
                <div id="description">{complaintinfo.description}</div>
        </div>
        </>
    )
    
}

function fetch_own_complaints(user:string):Promise<Response> {
    let url = new URL('http://localhost:4000/api/complaints/get/?email='+user)
    return fetch(url, { 
        method: "GET"
    });
}

export default ManageComplaints