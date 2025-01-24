import '../main.css';
import './interviewForm.css';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

type CandidateType = {
    email: string,
    first_name: string,
    last_name: string,
    status: string,
}

type QuestionType = {
    id: number,
    text: string,
}

type ReplyType = {
    id: number,
    answer: string,
}

function InterviewForm() {
    const [replies, setReplies] = useState([] as Array<ReplyType>);

    const params = useParams();
    const state = useLocation().state === undefined || useLocation().state === null ? {} : useLocation().state;
    const internship_id: number = params.internship_id === undefined ? 1 : Number.parseInt(params.internship_id);
    const email: string = params.candidate_email === undefined ? 'udefined' : params.candidate_email;
    const internship_title: string = state.internship_title === undefined ? 'Title' : state.internship_title;
    const candidate: CandidateType = state.candidate === undefined ? [] : state.candidate;
    const questions: Array<QuestionType> = state.questions === undefined ? [] : state.questions;

    async function fetch_replies(): Promise<void> {
        await fetch(`http://localhost:4000/api/candidates_selection/fetch/replies/${internship_id}/${candidate.email}`)
        .then(res => {
            if(!res.ok) {
                console.dir(res);
                return;
            }
            res.json().then(data => setReplies(JSON.parse(data) as Array<ReplyType>))
        })
    }

    console.log(useLocation());    
    
    return (
        <>
    		<div className="inner-box-section top-inner-box-section">
    			<div id="name">{internship_title}</div>
    			<div id="type"> 
    			    Internship #{Intl.NumberFormat("en-IN",{minimumIntegerDigits: 6, useGrouping: false}).format(internship_id)}
    			</div>
    			<div id="type" className="candidate-container">
    			    Candidate {candidate.first_name} {candidate.last_name} ({email})
    			</div>
    		</div>
    	</>
    )
}

export default InterviewForm;

