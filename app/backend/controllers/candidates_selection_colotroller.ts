import {Controller} from './controller';
import { Status } from '../utils/status';
import {InternshipManager} from '../components/internship_manager'

export class CandidateSelectionController extends Controller {
    private internshipManager: InternshipManager = new InternshipManager();
    
    public async handle(): Promise<void> {
        //
    }

    async fetch_candidates(): Promise<void> {
        let internship_id: number = Number.parseInt(this.req.params.internship_id);
        let result = await this.internshipManager.fetch_candidates(internship_id);
        if (result === Status.error) {
            this.res.status(500).json({ message: `Error fetching candidates for internship '${internship_id}'`});
        } else {
            console.dir(result);
            this.res.status(200).json(JSON.stringify(result));
        }
    }
    
    async fetch_form_questions(): Promise<void> {
        let internship_id: number = Number.parseInt(this.req.params.internship_id);
        let result = await this.internshipManager.fetch_interview_questions(internship_id);
        if (result === Status.error) {
            this.res.status(500).json({ message: `Error fetching form questions for internship '${internship_id}'`});
        } else {
            console.dir(result);
            this.res.status(200).json(JSON.stringify(result));
        }
    }
    
    async fetch_form_replies(): Promise<void> {
        let internship_id: number = Number.parseInt(this.req.params.internship_id);
        let student_email: string = this.req.params.student_email;
        let result = await this.internshipManager.fetch_candidate_replies(internship_id, student_email);
        if (result === Status.error) {
            this.res.status(500).json({ message: `Error fetching form replies for internship '${internship_id}' and candidate '${student_email}'`});
        } else {
            console.dir(result);
            this.res.status(200).json(JSON.stringify(result));
        }
    }

    async set_candidate_status(): Promise<void> {
        if (this.req.body.id === undefined || this.req.body.email === undefined || this.req.body.status === undefined) {
            this.res.status(400).json({ message: `Bad request: missing field`})
            return;
        }
        
        let internship_id: number = Number.parseInt(this.req.body.id);
        let student_email: string = this.req.body.email;
        let status: string = this.req.body.status;
        let result = await this.internshipManager.set_candidate_status(internship_id, student_email, status);

        if (result === Status.error) {
            this.res.status(500).json({ message: `Error setting status to '${status}' for candidate '${student_email}' in internship '${internship_id}'`});
        } else {
            console.dir(result);
            this.res.status(200).json(JSON.stringify(result));
        }
    }
}

