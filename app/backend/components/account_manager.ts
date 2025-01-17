import pool from "../utils/db_pool";
import {Status} from "../utils/status";
import {QueryResult} from "pg";

export class AccountManager {
    private email: String;
    private password: String;

    public constructor(email: String, password: String) {
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

    public async check_email_availability(email: string): Promise<Status> {
        try{
            let emailQuery = `
                SELECT email FROM "user" WHERE email=$1
            `;

            let result: QueryResult = await pool.query(emailQuery, [email]);
            if (result.rows.length > 0) {
                return Status.error; // Email is already taken
            }
            else
                return Status.ok; // Email is available
        } catch (error) {
            console.log(`(query error) ${error}`);
            return Status.Internal_Server_Error;
        }
    }

    public async get_universities(): Promise<any[]> {
        let universitiesQuery = `
            SELECT user_email, name FROM "university"
        `
        let result: QueryResult = await pool.query(universitiesQuery);
        return result.rows;
    }

    public async create_account(
        data:{email:string, userType:string, university:string, password:string}
    ): Promise<any> {
        let insertQuery = `
            INSERT INTO "user" (email, password, user_type)
            VALUES ($1, $2, $3)
        `;

        try {
            // Insert the new user into the database
            await pool.query(insertQuery, [
                data.email,
                data.password,
                data.userType.substring(0, 1),
            ]);

            if(data.userType === "student") {
                insertQuery = `
                    INSERT INTO "student" (user_email, university_email)
                    VALUES ($1, $2)
                `;

                await pool.query(insertQuery, [
                    data.email,
                    data.university,
                ]);

            }
            else if(data.userType === "company") {
                insertQuery = `
                    INSERT INTO "company" (user_email)
                    VALUES ($1)
                `;

                await pool.query(insertQuery, [
                    data.email,
                ]);

            }
            else if(data.userType === "university") {
                insertQuery = `
                    INSERT INTO "university" (user_email)
                    VALUES ($1)
                `;

                await pool.query(insertQuery, [
                    data.email,
                ]);
            }

            return Status.ok;

        } catch (error) {
            console.error('Error creating account:', error);
            return Status.error;
        }
    }
}
