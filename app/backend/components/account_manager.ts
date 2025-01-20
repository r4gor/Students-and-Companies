import pool from "../utils/db_pool";
import {Status} from "../utils/status";
import {QueryResult} from "pg";
import {saveBase64ToFile} from "../utils/exportBase64ToFile";

export class AccountManager {

    public async sign_in(email: String, password: String): Promise<[Status, String]> {
        let result;
        try {
            result = await pool.query(`SELECT password, user_type FROM "user" WHERE email=$1`, [email]);
        } catch (err) {
            console.log(`[server]: (query error) ${err}`);
            return [Status.error, ""];
        }

        if (result.rowCount == 0) {
            console.log(`[server]: ERROR SIGNIN: no account with email '${email}'`)
            return [Status.error, ""];
        } else if (result.rows[0].password != password) {
            console.log(`[server]: ERROR SIGNIN for '${email}': invalid password`);
            return [Status.error, ""];
        }
        console.log(`[server]: OK SIGNIN for '${email}'`);
        return [Status.ok, result.rows[0].user_type];
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

    public async get_user_profile(email: string): Promise<any[]> {
        if(email) {
            //coalesce prioritizes non null values
            let profileQuery = `
                SELECT *,
                    COALESCE(s.phone_number, c.phone_number, uni.phone_number) AS phone_number,
                    TO_CHAR(s.date_of_birth, 'YYYY-MM-DD') AS date_of_birth
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

    public async update_profile(formData: any): Promise<Status> {
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
                let updateProfileQuery = `
                    UPDATE "university" uni
                    SET name = $1, address = $2, website = $3, phone_number = $4
                    WHERE uni.user_email = $5;
                `;
                await pool.query(updateProfileQuery,
                    [formData.name, formData.address, formData.website, formData.phoneNumber, formData.userEmail]);
            }
            else if (formData.userType === "company") {
                let updateProfileQuery = `
                    UPDATE "company" c
                    SET name = $1, address = $2, website = $3, phone_number = $4
                    WHERE c.user_email = $5;
                `;
                await pool.query(updateProfileQuery,
                    [formData.name, formData.address, formData.website, formData.phoneNumber, formData.userEmail]);
            }
            else if(formData.userType === "student") {
                let updateProfileQuery = `
                    UPDATE "student" s
                    SET first_name = $1, last_name = $2, phone_number = $3, date_of_birth = $4
                    WHERE s.user_email = $5;
                `;
                await pool.query(updateProfileQuery,
                    [formData.firstName, formData.lastName, formData.phoneNumber, formData.dateOfBirth, formData.userEmail]);

                if(formData.cv) {
                    saveBase64ToFile(formData.cv, formData.userEmail);

                    let updateProfileQuery = `
                    UPDATE "student" s
                    SET cv = $1
                    WHERE s.user_email = $2;
                `;
                    await pool.query(updateProfileQuery,
                        ['models/cv_files' + formData.userEmail + '.pdf', formData.userEmail]);
                }
            }
            return Status.ok;
        }
        else
            return Status.error;
    }
}
