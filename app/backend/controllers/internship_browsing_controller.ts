import {Controller} from './controller'

export class InternshipBrowsingController extends Controller {

  	public async handle(): Promise<void> {
		let body = this.req.query;
		
		// bad params check
		if (body == undefined) {
			this.res.status(400).json({ message: "Bad request" });
			return;
		}
	}
}