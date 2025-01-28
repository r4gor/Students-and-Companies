import {Controller} from './controller'
import {InternshipManager, FeedbackType} from '../components/internship_manager'
import { Status } from '../utils/status';

class FeedbacksController extends Controller {
    private manager = new InternshipManager();
    
    public async handle(): Promise<void> {}

    public async fetch_feedback_questions(): Promise<void> {
        let body = this.req.body;

        //check for bad definitions of body and its expected fields
        if (body === undefined) {
            this.res.status(400).json({ message: "Missing request body" });
            return;
        }
        if (body.user_type === undefined) {
            this.res.status(400).json({ message: "Missing field" });
            return;
        } 

        let type = body.user_type;
        let result = await this.manager.fetch_feedback_questions(type);
        if (result === Status.error) {
            this.res.status(500).json({ message: `Error fetching feedback questions for user type '${type}'`});
        } else {
            console.dir(result);
            this.res.status(200).json(JSON.stringify(result));
        }
    }

    public async post_feedback(): Promise<void> {
        let body = this.req.body;

        //check for bad definitions of body and its expected fields
        if (body === undefined) {
            this.res.status(400).json({ message: "Missing request body" });
            return;
        }
        if (body.feedback === undefined) {
            this.res.status(400).json({ message: "Missing field 'feedback'" });
            return;
        }

        let feedback = <FeedbackType>body.feedback;
        let result = await this.manager.post_feedback(feedback);

        if (result === Status.error) {
            this.res.status(500).json({ message: `Error posting feedback of user '${feedback.user_email}' related to internship '${feedback.internship_id}' (question '${feedback.question_id}')`});
        } else {
            this.res.status(200).json(JSON.stringify(result));
        }
    }
}

export default FeedbacksController;
