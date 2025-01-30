import {Controller} from './controller'
import {InternshipManager, FeedbackType} from '../components/internship_manager'
import { Status } from '../utils/status';

class FeedbacksController extends Controller {
    private manager = new InternshipManager();
    
    public async handle(): Promise<void> {}

    public async fetch_feedbacks_state(): Promise<void> {
        let user_email = this.req.params.user_email;
        let result = await this.manager.fetch_feedbacks_state(user_email);
        if (result === Status.error) {
            this.res.status(500).json({ message: `Error fetching feedbacks state for user '${user_email}'`});
        } else {
            console.dir(result);
            this.res.status(200).json(JSON.stringify(result));
        }
    }

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
        if (body.feedbacks === undefined) {
            this.res.status(400).json({ message: "Missing field 'feedbacks'" });
            return;
        }

        let feedbacks = <Array<FeedbackType>>body.feedbacks;
        let result = await this.manager.post_feedback(feedbacks);

        if (result === Status.error) {
            this.res.status(500).json({ message: `Error posting feedbacks of user '${feedbacks[0].user_email}' related to internship '${feedbacks[0].internship_id}'`});
        } else {
            console.dir(result);
            this.res.status(200).json(JSON.stringify(result));
        }
    }
}

export default FeedbacksController;
