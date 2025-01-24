import { Status } from "../utils/status";
import pool from "../utils/db_pool";
import { format_date_for_database, get_current_datetime } from "../utils/date_utils";
import { fork } from "child_process";

export class InternshipManager {

    /**
     * Create a new internship
     * @param email Company email
     * @param title internship position summary
     * @param description internship description
     * @param application_end_date date after which will not possible to apply to the internship
     * @param start_date start date of the internship
     * @param end_date end date of the internship
     * @returns Status.ok if the internship has been created successfully, 
     * Status.error if an error occurred
     */
    public async create_internship (
        email: string, 
        title: string, 
        description: string,
        application_end_date: Date,
        start_date: Date,
        end_date: Date
    ) : Promise<Status> {
        try {
            await pool.query(
                `
                INSERT INTO internship (company_email, title, description, start, "end", published, application_end, status)
                VALUES ('${email}', '${title}', '${description}', to_date('${format_date_for_database(start_date)}', 'YYYY-MM-DD'), to_date('${format_date_for_database(end_date)}', 'YYYY-MM-DD'), to_date('${format_date_for_database(new Date(get_current_datetime()))}', 'YYYY-MM-DD'), to_date('${format_date_for_database(application_end_date)}', 'YYYY-MM-DD'), 'application')
                `
            );
            return Status.ok;
        } catch (err) {
            console.log(`[server]: (query error) (create internship) ${err}`);
            return Status.error;
        }
    }

    /**
     * Registers a user application to an internship
     * @param internship_id id of the internship
     * @param user_email email of the students that applies
     * @returns Status.error if the query failed, else true if the tuple has been added else false if the tuple was already present
     */
    public async apply_user_to_internship(internship_id:number, user_email:string) : Promise<boolean | Status> {
        try {
            let insert_application = await pool.query(
                `
                INSERT INTO student_internship (student_email, internship_id, status)
                VALUES ('${user_email}', ${internship_id}, 'applied')
                ON CONFLICT DO NOTHING
                `
            )
            return insert_application.rowCount === 1
        } catch (err) {
            console.log(`[server]: (query error) (create internship) ${err}`);
            return Status.error;
        }
    }

    public async fetch_student_internships(user:string) : Promise<Array<any> | Status>  {
        try {
            let internships = await pool.query(
                `
                SELECT title, SI.status
                FROM student_internship as SI join internship on SI.internship_id = internship."id"
                WHERE SI.student_email = '${user}'
                ORDER BY (SI.status = 'finished')
                `
            )
            return internships.rows
        } catch (err) {
            console.log(`[server]: (query error) (create internship) ${err}`);
            return Status.error;
        }
    }

    public async fetch_company_internships(user:string) : Promise<Array<any> | Status>  {
        try {
            let internships = await pool.query(
                `
                SELECT 	I.*, C.name AS company, (SELECT count(*) AS applied_students 
				                                 FROM student_internship 
				                                 WHERE internship_id=I.id
				                                ), null as tags
                FROM internship as I join company as C on C.user_email = I.company_email
                WHERE I.company_email = '${user}'
                `
            )
            return internships.rows
        } catch (err) {
            console.log(`[server]: (query error) (create internship) ${err}`);
            return Status.error;
        }
    }
}