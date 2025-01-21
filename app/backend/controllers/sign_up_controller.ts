import {Controller} from './controller'
import {AccountManager} from "../components/account_manager";
import {Status} from "../utils/status";

export class SignUpController extends Controller {
    private account_manager = new AccountManager();

    public async handle(): Promise<void> {
        let request_route_path = this.req.route.path;

        if(request_route_path == "/sign_up/get_universities"){
             this.res.json( JSON.stringify( await this.get_universities() ) );
             return;
        }
        if(request_route_path == "/sign_up/create_account"){
            await this.create_account(this.req.body);
            return;
        }
    }

    private async get_universities(): Promise<any[]> {
        return await this.account_manager.get_universities();
    }

    private async create_account(
        data:{email:string, userType:string, university:string, password:string}
    ): Promise<void> {
        let available_email: Status = await this.account_manager.check_email_availability(data.email)

        if(available_email == Status.ok){
            let result: Status = await this.account_manager.create_account(data);
            if(result == Status.ok){
                this.res.status(200).send({"message":"Successfully Signed up"});
            }
            else {
                this.res.status(500).send({"message":"Internal Error! Failed to create account"});
            }
        }
        else {
            this.res.status(400).send({error: "Email already in use"});
        }
    }
}