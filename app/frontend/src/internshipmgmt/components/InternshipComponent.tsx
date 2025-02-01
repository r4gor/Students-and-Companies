import { useState } from 'react';
import '../internshipMgmt.css';
import FeedbackPopup from './FeedbackPopup';
import { useNavigate } from 'react-router-dom'
import {useAppState} from "../../appstatecontext/AppStateContext.tsx";
import {format_search_parameters} from "../../searchpage/handle_search.ts";

function InternshipComponent({id, title, status, internship_status, position, feedbackSent}: {id:string, title:string, status:string, internship_status:string, position:number, feedbackSent:boolean | undefined}) {
    const [visibleFeedbackPopup, setVisibleFeedbackPopup] = useState(false);
    const [visibleFeedbackButton, setVisibleFeedbackButton] = useState(feedbackSent === undefined ? true : !feedbackSent);
    const internship_status_map = { 'applied':'waiting for selection',
                                    'accepted':'accepted',
                                    'rejected': 'rejected', 
                                    'finished': 'terminated',
                                    'rejected_offer': 'Offer rejected',
                                    'ongoing': 'ongoing'}
    if (status === 'accepted' && internship_status === 'interview') {
        status = 'applied'
    }
    const navigate = useNavigate()
    const student_email = useAppState().userEmail;
    function on_open_complaint() {
        navigate('/open_complaint/'+id)
    }

    function on_leave_feedback() {
        setVisibleFeedbackPopup(true);
        console.log('clicked leave feedback');
    }

    async function accept_decline_offer(accepted: number) {
        let url = new URL('http://localhost:4000/api/internship_management/update_offer');
        console.log(id)
        url.search = format_search_parameters({
            internship_id: id,
            accepted: accepted,
            student_email: student_email,
        })
        let response = await fetch(url, {method: 'POST'});
        let data = await response.json();

        console.log(data)
    }

    return (<>
        <div className={"internship-component" + 
                        (status === 'finished' || status === 'rejected' ? ' terminated':'') + 
                        (position%2 === 1 ? ' odd':'')}>
            <div className="left-group">
                <div id="name">{title}</div>
                <div id="status"><span className={status}></span> {internship_status_map[status as keyof typeof internship_status_map]}</div>
            </div>
            <div className="buttons-container">
                {status === 'accepted' && internship_status === 'ongoing' && (<button type="button" className="std-button small" id="accept" onClick={() => {accept_decline_offer(1)}}>Accept</button>)}
                {status === 'accepted' && internship_status === 'ongoing' && (<button type="button" className="std-button small" id="decline" onClick={() => {accept_decline_offer(0)}}>Decline</button>)}
            </div>
            {
                status === 'ongoing' && 
                internship_status === 'ongoing' && 
                (<button type="button" className="std-button small" id="complaint" onClick={on_open_complaint}>Open complaint</button>)
            }
            {
                status === 'finished' && 
                internship_status === 'terminated' && 
                visibleFeedbackButton &&
                (<button type="button" className="std-button small" id="feedback" onClick={() => on_leave_feedback()}>Leave feedback</button>)
            }
        </div>
        {
            visibleFeedbackPopup && 
            <FeedbackPopup 
                id={Number.parseInt(id)} 
                title={title}
                setVisible={setVisibleFeedbackPopup}
                hideButton={() => setVisibleFeedbackButton(false)}
            />
        }
    </>)
}

export default InternshipComponent
