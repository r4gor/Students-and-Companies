import {Controller} from './controller'
import {AccountManager} from "../components/account_manager";
import {Status} from "../utils/status";
import { InternshipManager } from '../components/internship_manager';

export class ApplyToInternshipController extends Controller {

    public async handle(): Promise<void> {
        let body = this.req.query;
        let internship_id: number = Number(body.internship_id as string);
        let user_email: string = body.user_email as string;

        if (body == undefined ||
            internship_id == undefined ||
            user_email == undefined
        ) {
			this.res.status(400).json({ message: "Bad request" });
			return;
		}

        let result = await new InternshipManager().apply_user_to_internship(internship_id, user_email);
        if(result === Status.error) {
            this.res.status(400).json({message: "Internal server error"})
            return;
        }
        if(result === false) {
            this.res.status(409).json({message: "Application already present"})
            return;
        }
        if(result === true) {
            this.res.status(200).json({message: "Application added successfully"})
            return;
        }
    }
}