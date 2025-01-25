import pool from "../utils/db_pool";
import {Status} from "../utils/status";
import {QueryResult} from "pg";
import {saveBase64ToFile} from "../utils/exportBase64ToFile";
import fs from "fs/promises";
import {SuggestionManager} from "./suggestion_manager";

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

            if(data.userType === "s") {
                insertQuery = `
                    INSERT INTO "student" (user_email, university_email)
                    VALUES ($1, $2)
                `;

                await pool.query(insertQuery, [
                    data.email,
                    data.university,
                ]);

            }
            else if(data.userType === "c") {
                insertQuery = `
                    INSERT INTO "company" (user_email)
                    VALUES ($1)
                `;

                await pool.query(insertQuery, [
                    data.email,
                ]);

            }
            else if(data.userType === "u") {
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
                    COALESCE(c.name, uni.name) AS name,
                    COALESCE(c.address, uni.address) AS address,
                    COALESCE(c.website, uni.website) AS website,
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
            if(formData.userType === "u") {
                let updateProfileQuery = `
                    UPDATE "university" uni
                    SET name = $1, address = $2, website = $3, phone_number = $4
                    WHERE uni.user_email = $5;
                `;
                await pool.query(updateProfileQuery,
                    [formData.name, formData.address, formData.website, formData.phoneNumber, formData.userEmail]);
            }
            else if (formData.userType === "c") {
                let updateProfileQuery = `
                    UPDATE "company" c
                    SET name = $1, address = $2, website = $3, phone_number = $4
                    WHERE c.user_email = $5;
                `;
                await pool.query(updateProfileQuery,
                    [formData.name, formData.address, formData.website, formData.phoneNumber, formData.userEmail]);
            }
            else if(formData.userType === "s") {
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
                        ['models/cv_files/' + formData.userEmail + '.pdf', formData.userEmail]);
                }
            }
            return Status.ok;
        }
        else
            return Status.error;
    }

    public async get_user_tags(email: string): Promise<any[]> {
        if(email) {
            let tagsQuery = `
            SELECT t.description
            FROM "tag_user" tu
                LEFT JOIN "tag" t on tu.tag_id = t.id
            WHERE tu.user_email = $1
            `;

            let result =  await pool.query(tagsQuery, [email]);
            // Return only the descriptions of tags
            return result.rows.map(row => row.description);
        }
        else
            return [];
    }

    public async add_tag_to_user(email: string, tag: string): Promise<any[]> {
        if(email && tag) {
            try{
                // Begin transaction
                await pool.query('BEGIN');

                // Check if the tag exists in the "tag" table
                const tagQuery = `
                    SELECT id 
                    FROM "tag"
                    WHERE description = $1
                `;
                const tagResult = await pool.query(tagQuery, [tag]);
                let tagId: number;

                if (tagResult.rows.length > 0) {
                    // If tag exists, get its id
                    tagId = tagResult.rows[0].id;
                } else {
                    // If tag doesn't exist, insert it and get the id
                    const insertTagQuery = `
                        INSERT INTO "tag" (description)
                        VALUES ($1)
                        RETURNING id
                    `;
                    const insertTagResult = await pool.query(insertTagQuery, [tag]);
                    tagId = insertTagResult.rows[0].id;
                }

                // Check if the tag is already associated with the user
                const associationQuery = `
                    SELECT *
                    FROM "tag_user"
                    WHERE user_email = $1 AND tag_id = $2
                `;
                const associationResult = await pool.query(associationQuery, [email, tagId]);

                if (associationResult.rows.length === 0) {
                    // If not already associated, insert into "tag_user"
                    const insertAssociationQuery = `
                        INSERT INTO "tag_user" (user_email, tag_id)
                        VALUES ($1, $2)
                    `;
                    await pool.query(insertAssociationQuery, [email, tagId]);
                }

                // Commit transaction
                await pool.query('COMMIT');

                // Fetch and return all tags associated with the user
                const tagsQuery = `
                    SELECT t.description
                    FROM "tag_user" tu
                    LEFT JOIN "tag" t ON tu.tag_id = t.id
                    WHERE tu.user_email = $1
                `;
                const result = await pool.query(tagsQuery, [email]);

                let tags = result.rows.map(row => row.description);
                await new SuggestionManager().suggest_student_to_companies(tags, email);

                return tags;
            } catch (error) {
                await pool.query('ROLLBACK'); // Rollback the transaction on error
                console.error('Error in add_tag_to_user:', error);
                throw error;
            }
        }
        else {
            throw new Error('Invalid email or tag');
        }
    }

    public async remove_tag_from_user(email: string, tag: string): Promise<string[]> {
        if (email && tag) {
            try {
                // Begin transaction
                await pool.query('BEGIN');

                // Get the tag ID from the "tag" table
                const tagQuery = `
                SELECT id
                FROM "tag"
                WHERE description = $1
            `;
                const tagResult = await pool.query(tagQuery, [tag]);

                if (tagResult.rows.length === 0) {
                    throw new Error(`Tag "${tag}" does not exist.`);
                }

                const tagId = tagResult.rows[0].id;

                // Delete the association from "tag_user"
                const deleteQuery = `
                DELETE FROM "tag_user"
                WHERE user_email = $1 AND tag_id = $2
            `;
                await pool.query(deleteQuery, [email, tagId]);

                // Commit transaction
                await pool.query('COMMIT');

                // Fetch and return the updated list of tags associated with the user
                const tagsQuery = `
                SELECT t.description
                FROM "tag_user" tu
                LEFT JOIN "tag" t ON tu.tag_id = t.id
                WHERE tu.user_email = $1
            `;
                const result = await pool.query(tagsQuery, [email]);

                return result.rows.map((row) => row.description);
            } catch (error) {
                await pool.query('ROLLBACK'); // Rollback the transaction on error
                console.error('Error in remove_tag_from_user:', error);
                throw error;
            }
        } else {
            throw new Error('Invalid email or tag');
        }
    }

    public async get_cv(email: string): Promise<any> {
        try {
            const query = `
                SELECT cv
                FROM "student"
                WHERE user_email = $1
            `;
            const result = await pool.query(query, [email]);

            if (result.rows.length === 0 || !result.rows[0].cv) {
                console.log('CV not found for this user.');
                return {};
            }

            const filePath = result.rows[0].cv; // Path to the CV file

            // Read the file from the file system
            const fileBuffer = await fs.readFile(filePath);

            // Convert file to Base64
            const base64Data = fileBuffer.toString('base64');

            // Return the file as Base64 with its MIME type
            const mimeType = 'application/pdf';

            return {
                base64: base64Data,
                mimeType: mimeType,
                fileName: filePath.split('/').pop() // Extract the file name from the path
            };
        } catch (error) {
            console.error('Error in get_cv:', error);
            throw error;
        }
    }

}
