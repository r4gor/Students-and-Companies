import {Controller} from './controller'
import {NotificationManager, Notification} from '../components/notification_manager'
import { Status } from '../utils/status';

export class NotificationController extends Controller {

    public async handle(): Promise<void> { }
    
    public async fetch(): Promise<void> {
        let email = this.req.params.email;
        let result = await new NotificationManager().fetch_notifications(email);
        if (result === Status.error) {
            this.res.status(500).json({ message: `Error fetching notifications for user '${email}'`});
        } else {
            // console.dir(result);
            this.res.status(200).json(JSON.stringify(result));
        }
    }

    public async mark_notification_as_read(): Promise<void> {
        let body = this.req.body;

        //check for bad definitions of body and its expected fields
        if (this.req.body.id === undefined) {
            this.res.status(400).json({ message: 'Missing field' });
            return;
        }
        
        let id = Number.parseInt(this.req.body.id);
        let result = await new NotificationManager().mark_notification_as_read(id);
        if (result === Status.error) {
            this.res.status(500).json({ message: `Error updating notification ${id}`});
        } else {
            this.res.status(200).send('OK');
        }
    } 

    public async post(): Promise<void> {
        let body = this.req.body;

        //check for bad definitions of body and its expected fields
        if (!Array.isArray(body.receivers)) {
            this.res.status(400).json({ message: "Bad format: field 'receivers' was expected as array" });
            return;
        } 
        if (!this.fields_are_strings([body.title, body.body].concat(body.receivers))) {
            this.res.status(400).json({ message: "Bad format: a field is undefined or not a string" });
            return;
        }

        let result = await new NotificationManager().post_notifications(body.receivers, body.title, body.body, body.sender);
        if (result == Status.error) {
            this.res.status(500).json({ message: "Query failed"});
        } else {
            this.res.status(200).send('OK');
        }
    }

    private fields_are_strings(fields: any[]): boolean {
        return fields.every(this.field_is_string);
    }

    private field_is_string(field: any): boolean {
        if (typeof field !== "string") {
            return false;
        }
        return true;
    }
}
