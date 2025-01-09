import pool from "../utils/db_pool";
import {Status} from "../utils/status";

export class AccountManager {
    private email: string;
    private password: string;

    public constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    public async sign_in(): Promise<Status> {
        try {
            console.dir(pool.options);
            const result = await pool.query("SELECT password FROM User WHERE email='${this.email}'");
            const users = result.rows;
            return Status.ok;
        } catch (err) {
            console.log("[server]: (query error) ${err}");
            return Status.error;
        }
    }
}
