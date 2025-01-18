import pool from "../utils/db_pool";
import {Status} from "../utils/status";
import {QueryResult} from "pg";

export class AccountManager {

    public async sign_in(): Promise<Status> {
        try {
            console.dir(pool.options);
            const result = await pool.query("SELECT password FROM user WHERE email='${this.email}'");
            const users = result.rows;
            return Status.ok;
        } catch (err) {
            console.log("[server]: (query error) ${err}");
            return Status.error;
        }
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

    public async get_user_profile(email: string): Promise<any> {
        if(email) {
            let profileQuery = `
                SELECT *
                FROM "user" u
                     LEFT JOIN "student" s ON u.email = s.user_email
                     LEFT JOIN "company" c ON u.email = c.user_email
                     LEFT JOIN "university" uni ON u.email = uni.user_email
                WHERE u.email = $1;
            `;
            let result: QueryResult = await pool.query(profileQuery, [email]);
            return result.rows;
        }
        else
            return []
    }

    public async update_profile(formData: any): Promise<string> {
        if(formData) {
            //update password
            if(formData.userType) {
                let updateProfileQuery = `
                    UPDATE "user" u
                    SET password = $1
                    WHERE u.email = $2;
                `;
                await pool.query(updateProfileQuery, [formData.password, formData.email]);
            }

            // update info
            if(formData.userType === "university") {

            }
            else if (formData.userType === "company") {

            }
            else if(formData.userType === "student") {

            }
            return '';
        }
        else
            return '';
    }
}
