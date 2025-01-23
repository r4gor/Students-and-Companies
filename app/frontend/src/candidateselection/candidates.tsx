import '../main.css';
import './select_candidates.css';
import {TopBar} from '../components/top_bar/top_bar';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

// type ReplyType = {
//     id: number,
//     answer: string,
// }

function CandidateRow(id: number, index: number, candidate: CandidateType, set_status: Function) {
    const is_interviewed: boolean = false;
    
    function container_class(): string {
        return "inner-container" + (is_interviewed ? " intervied" : "")
    }

    function button_accept_class(): string {
        return "std-button icon-content" + (candidate.status === "accepted" ? " ok" : "");
    }
    
    function button_reject_class(): string {
        return "std-button icon-content" + (candidate.status === "rejected" ? " no" : "");
    }

    function profile_url(): string {
        return `/profiles/${candidate.email}`
    }

    function handle_click_button_accept() {
        let status = candidate.status === "accepted" ? "applied" : "accepted";
        set_status(id, index, status);
    }
    
    function handle_click_button_reject() {
        let status = candidate.status === "rejected" ? "applied" : "rejected";
        set_status(id, index, status);
    }
    
    return (
		<div key={index} className={container_class()}>
			<i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
			<div id="name">{candidate.first_name} {candidate.last_name}</div>
			<button type="button" className="std-button small" id="profile">
			    <a href={profile_url()}>View profile</a>
			</button>
			<button type="button" className="std-button small" id="form">Open interview form</button>
			<div className="selector-button-container">
				<button type="button" className={button_accept_class()} id="profile" onClick={() => handle_click_button_accept()}>
				    <i className="material-icons">check</i>
				</button>
				<button type="button" className={button_reject_class()} id="profile" onClick={() => handle_click_button_reject()}>
				    <i className="material-icons">close</i>
				</button>
			</div>
		</div>
    );
}

function CandidateSelectionPage() {
    const [candidates, setCandidates] = useState([] as Array<CandidateType>);
    const [questions, setQuestions] = useState([] as Array<QuestionType>);

    const location = useLocation();
    const state = (location.state === null || location.state === undefined) ? {} : location.state;
    const internship_id: number = state.internship_id === undefined ? 1 : state.internship_id;
    const internship_title: string = state.internship_title === undefined ? 'Title' : state.internship_title;

    async function fetch_candidates(): Promise<void> {
        console.log('fetching candidates for internship ' + internship_id);
        await fetch(`http://localhost:4000/api/candidates_selection/fetch/candidates/${internship_id}`)
        .then(res => {
            if (!res.ok) {
                console.dir(res);
                return;
            }
            res.json().then((data) => setCandidates(JSON.parse(data) as Array<CandidateType>));
        })
        .catch(console.error);
    }
    
    async function fetch_questions(): Promise<void> {
        console.log('fetching questions for internship ' + internship_id);
        await fetch(`http://localhost:4000/api/candidates_selection/fetch/questions/${internship_id}`)
        .then(res => {
            if (!res.ok) {
                console.dir(res);
                return;
            }
            res.json().then((data) => setQuestions(JSON.parse(data) as Array<QuestionType>));
        })
        .catch(console.error);
    }

    async function set_candidate_status(id: number, index: number, status: string): Promise<void> {
		const options = {
			method: 'POST',
			headers: {
    			'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
			    id: id,
			    email: candidates[index].email,
			    status: status,
			})
		};
        await fetch('http://localhost:4000/api/candidates_selection/post/status', options)
        .then(res => {
            if (!res.ok) {
                console.dir(res);
                return;
            }
            const tmp = candidates.slice();
            tmp[index].status = status;
            setCandidates(tmp);
        })
        .catch(console.error);
    }

    useEffect(() => {
        fetch_candidates();
        fetch_questions();
    }, []);
    
    return (
        <>
            <div className="main-flex-container">
                <TopBar></TopBar>
    			<div className="central-container">
    				<div className="box-background">
    					<div className="inner-box-section top-inner-box-section">
    						<div id="name">{internship_title}</div>
    						<div id="type"> 
    						    Internship #{Intl.NumberFormat("en-IN",{minimumIntegerDigits: 6, useGrouping: false}).format(internship_id)}
    						</div>
    						<div className="button-container">
    							<button type="button" className="std-button" id="cv">
    							    End Interview Phase
    							</button>
    						</div>
    					</div>
    					<div className="inner-box-section" id="candidates">
    						<div className="box-composite-description">
    							<div className="box-description">
    								Candidates
    							</div>
    							<i className="material-icons" onClick={() => fetch_candidates()}>
    							    sync
    							</i>
    						</div>
    					    {candidates.map((c, i) => CandidateRow(internship_id, i, c, set_candidate_status))}
    					</div>
    				</div>
    			</div>
            </div>
        </>
    )
}

export default CandidateSelectionPage;
