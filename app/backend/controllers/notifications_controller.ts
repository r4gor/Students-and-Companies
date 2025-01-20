import {Controller} from './controller'
import {NotificationManager, Notification} from '../components/notification_manager'
import { Status } from '../utils/status';

export class NotificationController extends Controller {

    public async handle(): Promise<void> { }
    
    public async fetch(): Promise<void> {
        let email = this.req.params.email;
        let result = await new NotificationManager().fetch_notifications(email);
        if (result === Status.error) {
            this.res.status(400).json({ message: `Error fetching notifications for user '${email}'`});
        } else {
            console.dir(result);
            this.res.status(200).json(JSON.stringify(result));
        }
    }

    public async post(): Promise<void> {
        let body = this.req.body;

        //check for bad definitions of body and its expected fields
        if (body === undefined) {
            this.res.status(400).json({ message: "Missing request body" });
            return;
        }
        if (!Array.isArray(body.receivers)) {
            this.res.status(400).json({ message: "Bad format: field 'receivers' was expected as array" });
            return;
        } 
        if (!this.fields_are_strings([body.sender, body.title, body.body].concat(body.receivers))) {
            return;
        }

        let result = await new NotificationManager().post_notifications(body.email, body.receivers, body.title, body.body);
        if (result == Status.error) {
            this.res.status(500).json({ message: "Query failed"});
        } else {
            this.res.status(204);
        }
    }

    private fields_are_strings(fields: any[]): boolean {
        return fields.every(this.field_is_string);
    }

    private field_is_string(field: any): boolean {
        if (typeof field !== "string") {
            this.res.status(400).json({ message: `Bad format: expected a string, but received '${typeof field}'`});
            return false;
        }
        return true;
    }
}
