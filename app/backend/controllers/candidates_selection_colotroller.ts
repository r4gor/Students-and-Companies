import {Controller} from './controller';
import { Status } from '../utils/status';
import {InternshipManager} from '../components/internship_manager'

export class CandidateSelectionController extends Controller {
    private internshipManager: InternshipManager = new InternshipManager();
    
    public async handle(): Promise<void> {
        //
    }

    async fetch_candidates(): Promise<void> {
        let internship_id = Number.parseInt(this.req.params.internship_id);
        let result =await this.internshipManager.fetch_candidates(internship_id);
        if (result === Status.error) {
            this.res.status(400).json({ message: `Error fetching candidates for internship '${internship_id}'`});
        } else {
            console.dir(result);
            this.res.status(200).json(JSON.stringify(result));
        }
    }
}

