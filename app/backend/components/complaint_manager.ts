import pool from "utils/db_pool";
import { Status } from "utils/status";

export class ComplaintManager {

    /**
     * Fetches all university complaints i.e. all complaints in which at least one of their students is enrolled
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
                    FROM student join student_internship as SI on student.user_email = SI.student_email
                    WHERE university_email = $1 AND complaint.internship_id = SI.internship_id
                )
                `, [university_email]
            )
            return internships.rows
        } catch (err) {
            console.log(`[server]: (query error) (get complaints) ${err}`);
            return Status.error;
        }
    }

    public async post_complaint(user_email:string, internship_id:number, description:string) {
        try {
            await pool.query(
                `
                INSERT INTO complaint (user_email, internship_id, description)
                VALUES ($1, $2, $3)
                `, [user_email, internship_id, description]
            )
            return Status.ok
        } catch (err) {
            console.log(`[server]: (query error) (post complaints) ${err}`);
            return Status.error;
        }
    }
}