import {Controller} from './controller'
import {Status} from "../utils/status";
import { InternshipManager } from '../components/internship_manager';
import { NotificationManager } from '../components/notification_manager';

export class InternshipManagementController extends Controller {

    public async handle(): Promise<void> {
        let path = this.req.route.path
        switch (path) {
            case '/apply_to_internship/':
                this.add_application();
                break;
            case '/fetch_student_internships/':
                this.fetch_students_applications();
                break;
            case '/fetch_company_internships/':
                this.fetch_company_applications();
                break;
            case '/update_offer/':
                this.update_offer();
                break;
            case '/close_interview_phase/':
                this.close_interview_phase();
                break;
            case '/close_internship/':
                this.close_internship();
                break;
        }
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

    private async close_interview_phase() {
        let body = this.req.query;
        let internship_id = body.id as string;
        let user_email = body.user_email as string;

        if (body == undefined ||
            internship_id == undefined ||
            user_email == undefined
        ) {
			this.res.status(400).json({ message: "Bad request" });
			return;
		}
        let internship_manager = new InternshipManager()
        let result = await internship_manager.close_interview_phase(internship_id);
        let accepted_students = await internship_manager.fetch_internship_accepted_candidates(internship_id)
        let internship_name = await internship_manager.get_internship_name(internship_id)
        if(result === Status.error || accepted_students === Status.error) {
            this.res.status(400).json({message: "Internal server error"})
            return;
        }
        else {
            result = await new NotificationManager().post_notifications (
                accepted_students as string[], 
                "Accepted!", 
                "You have been accepted for the position: "+internship_name+"! Go to your [internship page](/internship_management) to accept or reject the offer.",
                user_email
            )
            if(result === Status.error) {
                this.res.status(400).json({message: "Internal server error"})
                return;
            }
            this.res.status(200).json({message: "Internship interview phase closed successfully"})
            return;
        }
    }

    private async update_offer() {
        let body = this.req.query;
        if (body == undefined ||
            body.internship_id === undefined ||
            body.student_email === undefined ||
            body.accepted === undefined
        ) {
			this.res.status(400).json({ message: "Bad request" });
			return;
		}

        let internship_id:string = body.internship_id as string
        let student_email:string = body.student_email as string
        let accepted:boolean = Number(body.accepted) === 1 ? true : false
        
        let result = await new InternshipManager().update_offer(internship_id,student_email,accepted)

        if(result === Status.error) {
            this.res.status(400).json({message: "Internal server error"})
            return;
        }
        this.res.status(200).json({message: "Internship offer updated successfully"})
        return;
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