import { ComplaintManager } from "components/complaint_manager";
import { Controller } from "./controller";
import { Status } from "utils/status";

export class ComplaintController extends Controller {
    public async handle(): Promise<void> {
        let path = this.req.route.path
        let body = this.req.query;
        if (body === undefined) {
            this.res.status(400).json({ message: "Bad request" });
			return;
        }

        if(path === '/get/')
            this.get_complaints(body)
        else if(path === '/post/')
            this.post_complaint(body)
    }

    public async get_complaints(body:any) {
        if(body.email === undefined) {
            this.res.status(400).json({ message: "Bad request" });
			return;
        }

        let university_email:string = body.email
        let result = await new ComplaintManager().get_complaints(university_email)

        if(result == Status.error) {
            this.res.status(400).json({message: "Internal server error"})
            return;
        }
        else {
            this.res.json(result)
            return;
        }
    }

    public async post_complaint(body:any) {
        if(body.email === undefined || 
            body.internship_id === undefined ||
            body.description === undefined) {
            this.res.status(400).json({ message: "Bad request" });
			return;
        }

        let university_email:string = body.email
        let internship_id:number = Number(body.internship_id)
        let description:string = body.description
        let recipient = body.recipient === undefined ? null : body.recipient

        let result = await new ComplaintManager().post_complaint(university_email, internship_id, description, recipient)

        if(result == Status.error) {
            this.res.status(400).json({message: "Internal server error"})
            return;
        }
        else {
            this.res.status(200).json({ message: "Complaint added successfully"});
            return;
        }
    }
}