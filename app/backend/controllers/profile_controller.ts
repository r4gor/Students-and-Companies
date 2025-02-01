import {Controller} from './controller'
import {AccountManager} from "../components/account_manager";
import {Status} from "../utils/status";
import {InternshipManager} from "../components/internship_manager";
import {NotificationManager} from "../components/notification_manager";

export class ProfileController extends Controller {
    private account_manager = new AccountManager();
    private internship_manager = new InternshipManager();
    private notifications_manager = new NotificationManager();

    public async handle(): Promise<void> {
        let request_route_path = this.req.route.path;

        if(request_route_path == "/profile/get_user_profile"){
            this.res.status(200).json( await this.get_user_profile(this.req.body.userEmail) );
            return;
        }

        if(request_route_path == "/profile/get_user_tags"){
            this.res.status(200).json( await this.get_user_tags(this.req.body.userEmail) );
            return;
        }

        if(request_route_path == "/profile/add_tag_to_user"){
            let result = await this.add_tag_to_user(this.req.body.userEmail, this.req.body.tag);
            let status = result === Status.error ? 400 : 200;
            this.res.status(status).json(result);
            return;
        }

        if(request_route_path == "/profile/remove_tag_from_user"){
            let result = await this.remove_tag_from_user(this.req.body.userEmail, this.req.body.tag);
            let status = result === Status.error ? 400 : 200;
            this.res.status(status).json(result);
            return;
        }

        if(request_route_path == "/profile/get_cv"){
            let result = await this.get_cv(this.req.body.userEmail);
            let status = result === Status.error ? 400 : 200;
            this.res.status(status).json(result);
            return;
        }

        if(request_route_path == "/profile/get_company_internships"){
            this.res.status(200).json( await this.get_company_internships(this.req.body.userEmail) );
            return;
        }

        if(request_route_path == "/profile/invite_student"){
            this.res.status(200).json( await this.invite_student(this.req.body) );
            return;
        }

    }

    private async get_user_profile(email:string): Promise<any[]> {
        return await this.account_manager.get_user_profile(email);
    }

    private async get_user_tags(email:string): Promise<any[]> {
        return await this.account_manager.get_user_tags(email);
    }

    private async add_tag_to_user(email: string, tag: string): Promise<any[] | Status.error> {
        return await this.account_manager.add_tag_to_user(email, tag);
    }

    private async remove_tag_from_user(email: string, tag: string): Promise<any[] | Status.error> {
        return await this.account_manager.remove_tag_from_user(email, tag);
    }

    private async get_cv(email: string): Promise<any[] | Status.error> {
        return await this.account_manager.get_cv(email);
    }

    private async get_company_internships(email: string): Promise<any[]> {
        return await this.internship_manager.get_company_internships(email);
    }

    private async invite_student(data: {companyEmail: string, internshipId: number, studentEmail: string}): Promise<string> {
        let title = "has invited you to apply to an internship!";
        let content = `[Internship Offer](/internship/${data.internshipId})`
        if( await this.notifications_manager.post_notifications([data.studentEmail], title, content, data.companyEmail) === Status.ok){
            return "Student invited successfully";
        }
        else {
            return "Error inviting student";
        }
    }
}
