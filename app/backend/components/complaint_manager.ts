import pool from "utils/db_pool";
import { Status } from "utils/status";

export class ComplaintManager {

    /**
     * Fetches all university complaints
     * @param university_email target universities
     * @returns a Promise containing a set of tuples representing complaints
     */
    public async get_complaints(university_email:string) : Promise<Array<any> | Status> {
        try {
            let internships = await pool.query(
                `
                SELECT *
                FROM complaint
                WHERE user_email in (
                    SELECT user_email
                    FROM student 
                    WHERE university_email = $1
                )
                `, [university_email]
            )
            return internships.rows
        } catch (err) {
            console.log(`[server]: (query error) (fetch company internship) ${err}`);
            return Status.error;
        }
    }

    public async post_complaint() {

    }
}