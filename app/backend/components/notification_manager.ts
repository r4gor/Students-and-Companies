import pool from "../utils/db_pool";
import {Status} from "../utils/status";

export type Notification = {
    toUser: string,
    // fromUser: string,
    title: string,
    body: string,
}

export class NotificationManager {

    public async fetch_notifications(email: string): Promise<Status.error | Array<Notification>> {
        return await pool.query('SELECT * FROM Notification WHERE user_email = $1', [email])
        .then(result => {
            if (result.rowCount == null) {
                return Status.error;
            }
            return result.rows.map((row, _) => <Notification>{
                toUser:email, 
                title:row.title, 
                body:row.body
            });
        })
        .catch(err => {
            console.error(err);
            return Status.error;
        })
    }

    public async post_notifications(
        userEmail: string, 
        dest: Array<string>, 
        title: string, 
        body: string)
    : Promise<Status> {
        let query: string = dest.map((email, _) => 
            `INSERT INTO Notification (user_email, title, body) 
             VALUE (${email}, ${title}, ${body});`
        ).join('\n');
        return await pool.query(query)
        .then(_ => Status.ok)
        .catch(err => {
            console.error(err);
            return Status.error;
        });
    }
}

