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

    public async get_company_internships(companyEmail: string): Promise<any[]> {
        let internshipsQuery = `
            SELECT *
            FROM "internship"
            WHERE company_email = $1 AND application_end > now()
        `;

        let result = await pool.query(internshipsQuery, [companyEmail]);

        return result.rows;
    }
    public async get_internship(internshipId: string): Promise<any[]> {
        let internshipsQuery = `
            SELECT
                i.id,
                i.company_email AS company,
                i.title,
                i.description,
                TO_CHAR(i.published, 'YYYY-MM-DD') AS post_date,
                TO_CHAR(i.application_end, 'YYYY-MM-DD') AS application_end_date,
                TO_CHAR(i.start, 'YYYY-MM-DD') AS start_date,
                TO_CHAR(i."end", 'YYYY-MM-DD') AS end_date,
                i.salary,
                i.mode,
                i.location,
                COALESCE(STRING_AGG(DISTINCT t.description, ' '), '') AS tags,
                COUNT(DISTINCT si.student_email) AS applied_students
            FROM
                internship i
                    LEFT JOIN
                tag_internship ti ON i.id = ti.internship_id
                    LEFT JOIN
                tag t ON ti.tag_id = t.id
                    LEFT JOIN
                student_internship si ON i.id = si.internship_id
            WHERE
                i.id = $1
            GROUP BY
                i.id;
        `;

        let result = await pool.query(internshipsQuery, [internshipId]);

        if (result.rows.length > 0) {
            return result.rows[0];
        }
        else
            return [];
    }


}