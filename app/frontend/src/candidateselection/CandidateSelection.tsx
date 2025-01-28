import '../main.css';
import './candidateSelection.css';
import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

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

function CandidateRow(
    id: number,
    index: number,
    candidate: CandidateType,
    questions: Array<QuestionType>,
    set_status: Function) {
     
    const is_interviewed: boolean = false;
    const state = {
        candidate: candidate,
        questions: questions,
    };

    function container_class(): string {
        return "inner-container" + (is_interviewed ? " intervied" : "")
    }

    function button_accept_class(): string {
        return "std-button icon-content" + (candidate.status === "accepted" ? " ok" : "");
    }
    
    function button_reject_class(): string {
        return "std-button icon-content" + (candidate.status === "rejected" ? " no" : "");
    }

    function profile_path(): string {
        return `/profiles/${candidate.email}`
    }

    function interview_form_path(): string {
        return `/candidates_selection/${id}/form/${candidate.email}`
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
			<div id="name">{candidate.last_name} {candidate.first_name}</div>
			<button type="button" className="std-button small" id="profile">
			    <Link to={profile_path()} target="_blank">View profile</Link>
			</button>
			<button type="button" className="std-button small" id="form">
			    {/*NOTE: target="_blank" deletes state => do not use it!*/}
			    <Link to={interview_form_path()} state={state}>Open interview form</Link> 
			</button>
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

function CandidateSelection() {
    const [candidates, setCandidates] = useState([] as Array<CandidateType>);
    const [questions, setQuestions] = useState([] as Array<QuestionType>);

    const params = useParams();
    const state = useLocation().state === null ? {} : useLocation().state;
    const internship_id: number = params.internship_id === undefined ? 1 : Number.parseInt(params.internship_id);
    const internship_title: string = state === undefined || state.internship_title === undefined ? 'Title' : state.internship_title;

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
			    {candidates.map((c, i) => CandidateRow(internship_id, i, c, questions, set_candidate_status))}
			</div>
        </>
    )
}

export default CandidateSelection;
