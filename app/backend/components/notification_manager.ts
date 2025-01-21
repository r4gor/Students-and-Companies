import pool from "../utils/db_pool";
import {Status} from "../utils/status";

export type Notification = {
    id: number,
    sender: string,
    // fromUser: string,
    title: string,
    content: string,
}

export class NotificationManager {

    public async fetch_notifications(email: string): Promise<Status.error | Array<Notification>> {
        return await pool.query('SELECT * FROM Notification WHERE user_email = $1 ORDER BY id DESC', [email])
        .then(result => {
            if (result.rowCount == null) {
                return Status.error;
            }
            return result.rows.map((row, _) => <Notification>{
                id: row.id,
                sender:row.sender, 
                title:row.title, 
                content:row.body,
                read: row.read
            });
        })
        .catch(err => {
            console.error(err);
            return Status.error;
        })
    }

    public async mark_notification_as_read(id: number): Promise<Status> {
        console.log(`marking notification ${id}`)
        return await pool.query('UPDATE Notification SET read=TRUE WHERE id=$1', [id])
        .then(_ => Status.ok)
        .catch(err => {
            console.error(err);
            return Status.error;
        })
    }

    public async post_notifications(
        receivers: Array<string>, 
        title: string, 
        content: string,
        sender: string | undefined, 
    ): Promise<Status> {
        let sender_col = ", sender";
        if (sender === undefined) {
            sender = ", SYSTEM";
            sender_col = "";
        } else {
            sender = ", " + sender;
        }
        let query: string = receivers.map((email, _) => 
            `INSERT INTO Notification (user_email, title, body, read${sender_col}) 
             VALUE (${email}, ${title}, ${content}, FALSE${sender});`
        ).join('\n');
        return await pool.query(query)
        .then(_ => Status.ok)
        .catch(err => {
            console.error(err);
            return Status.error;
        });
    }
}

