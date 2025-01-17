import {Status} from '../utils/status'
import pool from '../utils/db_pool'

export class AccountManager {
    private email: string;
    private password: string;

    public constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

  public async sign_in(): Promise<Status> {
    let result;
    try {
      result = await pool.query(`SELECT password FROM "user" WHERE email='${this.email}'`);
    } catch (err) {
      console.log(`[server]: (query error) ${err}`);
      return Status.error;
    }

    if (result.rowCount == 0) {
      console.log(`[server]: ERROR SIGNIN: no account with email '${this.email}'`)
      return Status.error;
    } else if (result.rows[0].password != this.password) {
      console.log(`[server]: ERROR SIGNIN for '${this.email}': invalid password`);
      return Status.error;
    }
    console.log(`[server]: OK SIGNIN for '${this.email}'`);
    return Status.ok;
  }
}
