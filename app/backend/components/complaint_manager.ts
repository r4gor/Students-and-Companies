import pool from "../utils/db_pool";
import { Status } from "../utils/status";

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
                OR recipient in (
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

    /**
     * Post a new complaint
     * @param user_email complaint sender
     * @param internship_id target internship
     * @param description complaint description
     * @param recipient complaint recipient, can be null
     * @returns a Promise containing an ok Status if the complaint has been added successfully,
     * else an error Status
     */
    public async post_complaint(user_email:string, internship_id:number, description:string, recipient:string | null) {
        try {
            if(recipient === null) { // if there's no recipient it means that a student sent it => retrieve it from internship table
                recipient = await this.get_company_from_internship(internship_id) as string
            }
            await pool.query(
                `
                INSERT INTO complaint (user_email, internship_id, description, recipient)
                VALUES ($1, $2, $3, $4)
                `, [user_email, internship_id, description, recipient]
            )
            return Status.ok
        } catch (err) {
            console.log(`[server]: (query error) (post complaints) ${err}`);
            return Status.error;
        }
    }

    private async get_company_from_internship(internship_id:number) : Promise<string | Status.error> {
        try {
            let result = await pool.query(
                `
                SELECT company_email
                FROM internship
                WHERE "id" = $1
                `, [internship_id]
            )
            return result.rows[0].company_email
        } catch (err) {
            console.log(`[server]: (query error) (post complaints) ${err}`);
            return Status.error;
        }
    }
}