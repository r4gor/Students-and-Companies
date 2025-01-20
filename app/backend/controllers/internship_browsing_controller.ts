import { Status } from '../utils/status';
import { SearchEngine } from '../components/search_engine';
import { Controller } from './controller'

export class InternshipBrowsingController extends Controller {
    private resultArray : string[] = [];

  	public async handle(): Promise<void> {
		let body = this.req.query;
        let text: string = (body.text as string).toLowerCase();
        let orderby: string = (body.orderby as string).toLowerCase();
        let ascending: boolean = Number(body.ascending as string) == 0 ? false:true;
        let salary: number = Number(body.salary)
        let duration: number = Number(body.duration)
        let mode: string = (body.mode as string).toLowerCase();
        let tags: string[] = body.tags !== '' ? (body.tags as string).split(' ') as string[] : [];
		
		// bad params check
		if (body == undefined ||
            text == undefined ||
            orderby == undefined ||
            ascending == undefined ||
            salary == undefined ||
            duration == undefined ||
            mode == undefined ||
            tags == undefined
        ) {
			this.res.status(400).json({ message: "Bad request" });
			return;
		}
        
        if (!SearchEngine.order_by_valid_values.includes(orderby)) {
			this.res.status(400).json({ message: "Invalid order by parameter: " + orderby });
			return;
		}

        if (!SearchEngine.mode_valid_values.includes(mode)) {
			this.res.status(400).json({ message: "Invalid mode parameter: " + mode });
			return;
		}
        
        let result: Array<any> | Status = await new SearchEngine().get_internships(text,orderby,ascending,salary,duration,mode,tags);
        if(result == Status.error) {
            this.res.status(400).json({message: "Internal server error"})
            return;
        }
        else {
            this.res.json(result)
            return;
        }
	}
}