import { useAppState } from '../appstatecontext/AppStateContext';
import '../main.css';
import './candidateSelection.css';
import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

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

function CandidateRow(params: {
    id: number,
    index: number,
    candidate: CandidateType,
    internship_title: string,
    questions: Array<QuestionType>,
    set_status: Function}) {
     
    const is_interviewed: boolean = false;
    const state = {
        candidate: params.candidate,
        questions: params.questions,
        internship_title: params.internship_title,
    };

    function container_class(): string {
        return "inner-container" + (is_interviewed ? " intervied" : "")
    }

    function button_accept_class(): string {
        return "std-button icon-content" + (params.candidate.status === "accepted" ? " ok" : "");
    }
    
    function button_reject_class(): string {
        return "std-button icon-content" + (params.candidate.status === "rejected" ? " no" : "");
    }

    function profile_path(): string {
        return `/profile/${params.candidate.email}`
    }

    function interview_form_path(): string {
        return `/candidates_selection/${params.id}/form/${params.candidate.email}`
    }

    function handle_click_button_accept() {
        let status = params.candidate.status === "accepted" ? "applied" : "accepted";
        params.set_status(params.id, params.index, status);
    }
    
    function handle_click_button_reject() {
        let status = params.candidate.status === "rejected" ? "applied" : "rejected";
        params.set_status(params.id, params.index, status);
    }
    
    return (
        <div key={params.index} className={container_class()}>
            <i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
            <div id="name">{params.candidate.last_name} {params.candidate.first_name}</div>
            <Link to={profile_path()} target="_blank">
                <button type="button" className="std-button small" id="profile">
                    View profile
                </button>
            </Link>
            <Link to={interview_form_path()} state={state}>
                <button type="button" className="std-button small" id="form">
                    {/*NOTE: target="_blank" deletes state => do not use it!*/}
                    Open interview form
                </button>
            </Link>
            <div className="selector-button-container">
                <button type="button" className={button_accept_class()} id="profile"
                        onClick={() => handle_click_button_accept()}>
                    <i className="material-icons">check</i>
                </button>
                <button type="button" className={button_reject_class()} id="profile"
                        onClick={() => handle_click_button_reject()}>
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
    const navigate = useNavigate();
    const state = useLocation().state === null ? {} : useLocation().state;
    const context = useAppState();
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

    async function close_interview_phase(): Promise<void> {
		const options = {
			method: 'POST',
			headers: {
    			'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
			    internship_id: `${internship_id}`,
			    user_email: context.userEmail,
			})
		};
        await fetch('http://localhost:4000/api/internship_management/close_interview_phase', options)
        .then(res => {
            if (!res.ok) {
                console.dir(res);
                return;
            }
            navigate('/internship_management')
        })
        .catch(console.error);
    }

    useEffect(() => {
        fetch_candidates();
        fetch_questions();
    }, []);
    
    return (
        <>  
        <div className="candidate-selection">
			<div className="inner-box-section top-inner-box-section">
				<div id="name">{internship_title}</div>
				<div id="type"> 
				    Internship #{Intl.NumberFormat("en-IN",{minimumIntegerDigits: 6, useGrouping: false}).format(internship_id)}
				</div>
				<div className="button-container">
					<button type="button" className="std-button" id="cv" onClick={close_interview_phase}>
					    End Interview Phase
					</button>
				</div>
			</div>
			<div className="inner-box-section" id="candidates">
				<div className="box-composite-description">
					<div className="box-description">
						Candidates
					</div>
					<i className="material-icons" onClick={() => fetch_candidates()} id='sync'>
					    sync
					</i>
				</div>
			    {candidates.map((c, i) => CandidateRow({
			        id: internship_id, 
			        index: i, 
			        candidate: c, 
			        internship_title: internship_title, 
			        questions: questions, 
			        set_status: set_candidate_status
			    }))}
			</div>
        </div>
        </>
    )
}

export default CandidateSelection;
