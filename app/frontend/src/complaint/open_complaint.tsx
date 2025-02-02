import { useNavigate, useParams } from "react-router-dom";
import TopBarCentralText from "../components/top_bar/top_bar_central_text";
import { useAppState } from "../appstatecontext/AppStateContext";
import { ChangeEvent, useEffect, useState } from "react";
import './open_complaint.css'
import { format_search_parameters } from "../searchpage/handle_search";

type Student = {
    email:string,
    first_name:string,
    last_name:string,
    status:string
}

function OpenComplaint() {
	const { internship_id } = useParams<{ internship_id?: string }>();
    const user_email = useAppState().userEmail
    const user_type = useAppState().userType
    const [recipient, setRecipient] = useState('')
    const [description, setDescription] = useState('')
    const [invalid_descr, setInvalidDescr] = useState(false)
    const navigate = useNavigate()

    function on_send_click() {
        if(description === '') {
            setInvalidDescr(true)
            return;
        }

        post_complaint({
            email: user_email,
            internship_id: internship_id,
            description: description,
            recipient: recipient
        }).then(res => {
            if(res.ok) {
                navigate("/internship_management")
            }
        })
    }

    return (
        <>
        <div className="open-complaint">
            <div className="main-flex-container">
                <TopBarCentralText text='Open complaint'></TopBarCentralText>
                <div className="central-container">
                    <div className="box-background">
                        <div className="inner-box-section">
                            <p>In this page you can open a new complaint. Please be aware that the information you provide inside this form will only be visible 
                                by {user_type === 's' ? 'your university':'the students university'}.
                            </p>
                            {user_type === 'c' && <StudentSelector 
                                internship_id={internship_id} 
                                user_type={user_type}
                                set_recipient={setRecipient}>
                            </StudentSelector>}
							<div id="label">Please describe the problem in the field below with as much detail as possible:</div>
                            <textarea 	name='description'
										id='description'
										value={description}
										placeholder='Describe the problem'
                                        rows={4}
										onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
							/>
                            {invalid_descr && (<div className="error-label">This field cannot be empty!</div>)}
                            <div className="buttons-container">
                                <button type="button" className="std-button" onClick={on_send_click}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

function StudentSelector(params: {
    internship_id:string | undefined, 
    user_type:string,
    set_recipient:Function
}) {
    const [students, setStudents] = useState([] as Student[])
    const fetch_this_internship_students: any = async () => {
        const response = await fetch_students(params.internship_id)
        const data = await response.json()
        setStudents(JSON.parse(data) as Student[])
    }

    useEffect(() => {
        if(params.user_type === 'c') {
            fetch_this_internship_students()
        }
    },[])

    return (
        <>
        <div id="label">Please select a student:</div>
        <select name="students" id="students" onChange={(e:any) => params.set_recipient(e.target.value)}>
            {
                
                students
                .filter(s => s.status === 'ongoing')
                .map((student, i) => (<option key={i}>{student.first_name} {student.last_name}</option>))
            }
        </select>
        </>
    )
}

function fetch_students(internship_id:string | undefined):Promise<Response> {
    let url = new URL('http://localhost:4000/api/candidates_selection/fetch/candidates/'+internship_id)
    return fetch(url, { 
        method: "GET"
    });
}

function post_complaint(parameters:Object) {
    let url = new URL("http://localhost:4000/api/complaints/post/")
    url.search = format_search_parameters(parameters, false)
    return fetch(url, { 
        method: "POST"
    });
}

export default OpenComplaint
