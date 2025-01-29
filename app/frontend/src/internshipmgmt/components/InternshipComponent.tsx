import { useState } from 'react';
import '../internshipMgmt.css';
import FeedbackPopup from './FeedbackPopup';

function InternshipComponent({id, title, status, position}: {id:string, title:string, status:string, position:number}) {
    const [visibleFeedbackPopup, setVisibleFeedbackPopup] = useState(false);
    const internship_status_map = { 'applied':'waiting for selection',
                                    'accepted':'accepted', 
                                    'rejected': 'rejected', 
                                    'finished': 'terminated'}
    function on_open_complaint() {
        //TODO: add implementation
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
            {status === 'accepted' && (<button type="button" className="std-button small" id="complaint" onClick={on_open_complaint}>Open complaint</button>)}
            {status === 'finished' && (<button type="button" className="std-button small" id="feedback" onClick={() => on_leave_feedback()}>Leave feedback</button>)}
        </div>
        {visibleFeedbackPopup && <FeedbackPopup 
            id={Number.parseInt(id)} 
            title={title}
            setVisible={setVisibleFeedbackPopup}
            />}
        </>
    )
}

export default InternshipComponent
