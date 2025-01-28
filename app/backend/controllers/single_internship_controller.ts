import {Controller} from './controller'
import {InternshipManager} from "../components/internship_manager";

export class SingleInternshipController extends Controller {
    private internship_manager = new InternshipManager();

    public async handle(): Promise<void> {
        let request_route_path = this.req.route.path;

        if(request_route_path == "/single_internship/get_internship"){
            this.res.status(200).json( await this.get_internship(this.req.body.internshipId) );
            return;
        }
    }

    private async get_internship(internshipId: string): Promise<any[]> {
        return await this.internship_manager.get_internship(internshipId);
    }

}