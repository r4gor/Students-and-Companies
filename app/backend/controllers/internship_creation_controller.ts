import {Controller} from './controller'
import { InternshipManager } from '../components/internship_manager';
import { Status } from '../utils/status';

export class InternshipCreationController extends Controller {

  	public async handle(): Promise<void> {
		let body = this.req.query;
		
		if (body === undefined ||
			body.email === undefined ||
			body.title === undefined ||
			body.description === undefined ||
			body.application_end_date === undefined ||
			body.start_date === undefined ||
			body.end_date === undefined ||
			body.salary === undefined ||
			body.mode === undefined ||
			body.location === undefined ||
			body.questions === undefined
		) {
			this.res.status(400).json({ message: "Bad request" });
			return;
		}
		let email: string =  body.email as string;
        let title: string = body.title as string;
        let description: string = body.description as string;
        let application_end_date: Date = new Date(body.application_end_date as string);
        let start_date: Date = new Date(body.start_date as string);
        let end_date: Date = new Date(body.end_date as string);
		let salary: number = Number(body.salary as string);
		let mode: string = body.mode as string;
		let location: string = body.location as string;
		let tags: string[] = body.tags === undefined ? [] : (body.tags as string).split(' ')
		let questions: string[] = body.questions === undefined ? [] : (body.questions as string).split('\n')
		// bad params check
		
		if (start_date >= end_date || application_end_date >= start_date || application_end_date >= end_date) {
			this.res.status(400).json({ message: "Invalid dates"});
			return;
		}
		if(tags.length)
			tags.forEach((tag) => tag=tag.toLowerCase())
		let result = await new InternshipManager().create_internship(email, 
																	title, 
																	description, 
																	application_end_date, 
																	start_date,
																	end_date,
																	tags,
																	salary,
																	mode,
																	location,
																	questions);
		if (result == Status.ok) {
			this.res.status(200).json({ message: "Internship added successfully"});
		} else {
			this.res.status(400).json({ message: "Failed to add internship"});
		}
	}
}