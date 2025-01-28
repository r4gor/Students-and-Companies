import {CandidateSelectionController} from '../controllers/candidates_selection_colotroller'
import {Router, Request, Response} from 'express';

export const candidate_selection_route = Router();

candidate_selection_route.get('/fetch/candidates/:internship_id', (req: Request, res:Response) => {
    new CandidateSelectionController(req, res).fetch_candidates();
});

candidate_selection_route.get('/fetch/questions/:internship_id', (req: Request, res:Response) => {
    new CandidateSelectionController(req, res).fetch_form_questions();
});

candidate_selection_route.get('/fetch/replies/:internship_id/:student_email', (req: Request, res:Response) => {
    new CandidateSelectionController(req, res).fetch_form_replies();
});

candidate_selection_route.post('/post/status', (req: Request, res:Response) => {
    new CandidateSelectionController(req, res).set_candidate_status();
});

candidate_selection_route.post('/post/replies', (req: Request, res:Response) => {
    new CandidateSelectionController(req, res).post_candidate_replies();
});
