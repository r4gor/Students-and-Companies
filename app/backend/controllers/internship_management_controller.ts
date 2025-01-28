import {Controller} from './controller'
import {AccountManager} from "../components/account_manager";
import {Status} from "../utils/status";
import { InternshipManager } from '../components/internship_manager';

export class InternshipManagementController extends Controller {

    public async handle(): Promise<void> {
        let path = this.req.route.path
        if(path === '/apply_to_internship/')
            this.add_application()
        else if(path === '/fetch_student_internships/')
            this.fetch_students_applications()
        else if(path === '/fetch_company_internships/')
            this.fetch_company_applications()
        else if(path === '/close_internship/')
            this.close_internship()
    }

    private async add_application() {
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

    private async fetch_students_applications() {
        let body = this.req.query;
        let user_email = body.user as string;

        if (body == undefined ||
            user_email == undefined
        ) {
			this.res.status(400).json({ message: "Bad request" });
			return;
		}
        let result = await new InternshipManager().fetch_student_internships(user_email);
        if(result == Status.error) {
            this.res.status(400).json({message: "Internal server error"})
            return;
        }
        else {
            this.res.json(result)
            return;
        }
    }

    private async fetch_company_applications() {
        let body = this.req.query;
        let user_email = body.user as string;

        if (body == undefined ||
            user_email == undefined
        ) {
			this.res.status(400).json({ message: "Bad request" });
			return;
		}
        let result = await new InternshipManager().fetch_company_internships(user_email);
        if(result == Status.error) {
            this.res.status(400).json({message: "Internal server error"})
            return;
        }
        else {
            this.res.json(result)
            return;
        }
    }

    private async close_internship() {
        let body = this.req.query;
        let internship_id = body.id as string;

        if (body == undefined ||
            internship_id == undefined
        ) {
			this.res.status(400).json({ message: "Bad request" });
			return;
		}
        let result = await new InternshipManager().close_internship(internship_id);
        if(result == Status.error) {
            this.res.status(400).json({message: "Internal server error"})
            return;
        }
        else {
            this.res.status(200).json({message: "Internship closed successfully"})
            return;
        }
    }
}