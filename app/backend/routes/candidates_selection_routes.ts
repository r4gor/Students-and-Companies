import {CandidateSelectionController} from '../controllers/candidates_selection_colotroller'
import {Router, Request, Response} from 'express';

const candidate_selection_route = Router();

candidate_selection_route.get('/fetch/candidates/:internship_id', (req: Request, res:Response) => {
    new CandidateSelectionController(req, res).fetch_candidates();
});
