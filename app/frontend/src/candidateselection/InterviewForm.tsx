import '../main.css';
import './interviewForm.css';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from "react-router";

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

function Module(index: number, question: QuestionType, init_reply: string, set_reply: Function) {
    const [_, setReply] = useState(init_reply);
    const question_index = Intl.NumberFormat("en-IN",{minimumIntegerDigits: 2}).format(index+1);
    
    return (
        <div key={index} className="module" >
            <div className="question">{question_index}. {question.text}</div>
            <textarea 
                wrap="soft"
                cols={80}
                rows={4}
                defaultValue={init_reply}
                // value={reply}
                onChange={(e) => {
                    setReply(e.target.value);
                    set_reply(question.id, e.target.value);
                }}>
            </textarea>
        </div>
    )
}

function InterviewForm() {
    const [replies, setReplies] = useState(new Map<number, string>());

    const navigate = useNavigate();
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
            res.json().then(data => setReplies(
                (JSON.parse(data) as Array<ReplyType>)
                .reduce((acc, reply) => {
                    acc.set(reply.id, reply.answer);
                    return acc;
                }, new Map<number, string>())
            ));
        }).catch(console.error)
    }

    async function post_replies(): Promise<void> {
		const options = {
			method: 'POST',
			headers: {
    			'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			    email: candidate.email,
			    replies: [...replies.entries()].map(value => ({id:value[0], answer:value[1]}))
			})
		};
        await fetch(`http://localhost:4000/api/candidates_selection/post/replies`, options)
        .then(res => {
            if(!res.ok) {
                console.dir(res);
                return;
            }
            console.log('replies posted!');
            navigate("../");
            
        }).catch(console.error)
    }

    function set_reply(id: number, value: string) {
        setReplies(replies.set(id, value));
    }

    useEffect(() => {fetch_replies()}, []);

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
    	    <div className="inner-box-section">
        	    {questions.map((q,i) => {
        	        let reply = replies.has(q.id) ? replies.get(q.id) as string : "";
        	        return Module(i, q, reply, set_reply);
        	    })}
        	    <div className="submit-container">
    				<button type="button" className="std-button" id="submit" onClick={() => post_replies()}>
    				    submit
    				</button>
        	    </div>
    	    </div>
    	</>
    )
}

export default InterviewForm;
