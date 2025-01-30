import { useState } from 'react';
import '../internshipMgmt.css';
import FeedbackPopup from './FeedbackPopup';
import { useNavigate } from 'react-router-dom'

function InternshipComponent({id, title, status, position, feedbackSent}: {id:string, title:string, status:string, position:number, feedbackSent:boolean | undefined}) {
    const [visibleFeedbackPopup, setVisibleFeedbackPopup] = useState(false);
    const [visibleFeedbackButton, setVisibleFeedbackButton] = useState(feedbackSent === undefined ? true : !feedbackSent);
    const internship_status_map = { 'applied':'waiting for selection',
                                    'accepted':'accepted', 
                                    'rejected': 'rejected', 
                                    'finished': 'terminated'}
    const navigate = useNavigate()
    function on_open_complaint() {
        navigate('/open_complaint/'+id)
    }

    function on_leave_feedback() {
        setVisibleFeedbackPopup(true);
        console.log('clicked leave feedback');
    }
    
    return (
        <>
        <div className={"internship-component" + 
                        (status === 'finished' || status === 'rejected' ? ' terminated':'') + 
                        (position%2 === 1 ? ' odd':'')}>
            <div className="left-group">
                <div id="name">{title}</div>
                <div id="status"><span className={status}></span> {internship_status_map[status as keyof typeof internship_status_map]}</div>
            </div>
            {
                status === 'accepted' && 
                (<button type="button" className="std-button small" id="complaint" onClick={on_open_complaint}>Open complaint</button>)
            }
            {
                status === 'finished' && 
                visibleFeedbackButton &&
                (<button type="button" className="std-button small" id="feedback" onClick={() => on_leave_feedback()}>Leave feedback</button>)
            }
        </div>
        {visibleFeedbackPopup && <FeedbackPopup 
            id={Number.parseInt(id)} 
            title={title}
            setVisible={setVisibleFeedbackPopup}
            hideButton={() => setVisibleFeedbackButton(false)}
            hideButton={() => setVisibleFeedbackButton(false)}
            />}
        </>
    )
}

export default InternshipComponent
