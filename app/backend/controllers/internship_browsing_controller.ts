import { Status } from '../utils/status';
import { SearchEngine, SearchQueryParams } from '../components/search_engine';
import { Controller } from './controller'

export class InternshipBrowsingController extends Controller {
    private resultArray : string[] = [];

  	public async handle(): Promise<void> {
        let path = this.req.route.path
        if(path === '/query/')
            this.handle_query()
        else if(path === '/tags/')
            this.request_all_tags()
	}

    private async handle_query() {
        let body = this.req.query;
        let query_params: SearchQueryParams = {
            user:       body.user as string,
            text:       (body.text as string).toLowerCase(),
            orderby:    (body.orderby as string).toLowerCase(),
            ascending:  Number(body.ascending as string) == 0 ? false:true,
            salary:     Number(body.salary),
            duration:   Number(body.duration),
            mode:       (body.mode as string).toLowerCase(),
            tags:       body.tags !== '' ? (body.tags as string).split(' ') as string[] : []
        }
		
		// bad params check
		if (body == undefined ||
            Object.values(query_params).reduce((acc,val) => val == undefined || acc,false)
        ) {
			this.res.status(400).json({ message: "Bad request" });
			return;
		}
        
        if (!SearchEngine.order_by_valid_values.includes(query_params.orderby)) {
			this.res.status(400).json({ message: "Invalid order by parameter: " + query_params.orderby });
			return;
		}

        if (!SearchEngine.mode_valid_values.includes(query_params.mode)) {
			this.res.status(400).json({ message: "Invalid mode parameter: " + query_params.mode });
			return;
		}
        
        let result: Array<any> | Status = await new SearchEngine().get_internships(query_params);
        if(result == Status.error) {
            this.res.status(400).json({message: "Internal server error"})
            return;
        }
        else {
            this.res.json(result)
            return;
        }
    }

    private async request_all_tags() {
        let result = await new SearchEngine().get_all_tags()
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