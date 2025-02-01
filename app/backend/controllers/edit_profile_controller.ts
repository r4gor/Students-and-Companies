import {Controller} from './controller'
import {AccountManager} from "../components/account_manager";
import {Status} from "../utils/status";

export class EditProfileController extends Controller {
    private account_manager = new AccountManager();

    public async handle(): Promise<void> {
        let request_route_path = this.req.route.path;

        if(request_route_path == "/edit_profile/get_user_profile"){
            this.res.status(200).json( await this.get_user_profile(this.req.body.userEmail) );
            return;
        }
        if(request_route_path == "/edit_profile/update_profile"){
            let result = await this.update_profile(this.req.body);
            let status = result === Status.ok ? 200 : 400;
            this.res.status(status).json(result);
            return;
        }
    }

    private async get_user_profile(email:string): Promise<any[]> {
        return await this.account_manager.get_user_profile(email);
    }

    private async update_profile(formData:any): Promise<Status> {
        return await this.account_manager.update_profile(formData);
    }
}
