import { Status } from "../utils/status";
import pool from "../utils/db_pool";
import { format_date_for_database, get_current_datetime } from "../utils/date_utils";
import { fork } from "child_process";

export class InternshipManager {

    /**
     * Creates a new internship with the passed parameters inside the database
     * @param email Company email
     * @param title internship position summary
     * @param description internship description
     * @param application_end_date date after which will not possible to apply to the internship
     * @param start_date start date of the internship
     * @param end_date end date of the internship
     * @param tags list of tags that identifies the internship
     * @returns an async Promise containing: Status.ok if the internship has been created successfully,
     * Status.error if an error occurred
     */
    public async create_internship (
        email: string, 
        title: string, 
        description: string,
        application_end_date: Date,
        start_date: Date,
        end_date: Date,
        tags: string[],
        salary: number,
        mode: string,
        location: string
    ) : Promise<Status> {
        try {
            let result = await this.create_internship_inside_db(email,title,description,application_end_date,start_date,end_date, salary, mode, location)
            if(!tags.length)
                return Status.ok;
            await this.insert_new_tags(result.rows[0].id,tags)
            return Status.ok
        } catch (err) {
            console.log(`[server]: (query error) (create internship) ${err}`);
            return Status.error;
        }
    }

    private async insert_new_tags(internship_id:string, tags: string[]) {
        return pool.query (
            `
            INSERT INTO tag (description)
            VALUES ${this.format_tag_list(tags,true)}
            ON CONFLICT DO NOTHING;

            INSERT INTO tag_internship
            SELECT id, ${internship_id} as internship_id
            FROM tag
            WHERE description in ${this.format_tag_list(tags)};
            `
        )
    }

    private format_tag_list(tags:string[], middle_parentheses=false): string {
        if(middle_parentheses)
            return "('"+ tags.join("'),('") + "')"
        else
            return "('"+ tags.join("','") + "')"

    }

    private async create_internship_inside_db (
        email: string,
        title: string,
        description: string,
        application_end_date: Date,
        start_date: Date,
        end_date: Date,
        salary: number,
        mode: string,
        location: string
    ) {
        return pool.query (
            `
            INSERT INTO internship (company_email, title, description, start, "end", published, application_end, status, salary, mode, location)
            VALUES ('${email}',
                    '${title}', 
                    '${description}', 
                    to_date('${format_date_for_database(start_date)}', 'yyyy-MM-DD'), 
                    to_date('${format_date_for_database(end_date)}', 'yyyy-MM-DD'), 
                    to_date('${format_date_for_database(new Date())}', 'yyyy-MM-DD'), 
                    to_date('${format_date_for_database(application_end_date)}', 'yyyy-MM-DD'), 
                    'application',
                    ${salary},
                    '${mode}',
                    '${location}')
            RETURNING id
            `
        );
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
                i.id AS id,
                i.company_email AS company,
                i.title AS title,
                i.description AS description,
                TO_CHAR(i.published, 'YYYY-MM-DD') AS published,
                TO_CHAR(i.application_end, 'YYYY-MM-DD') AS application_end,
                TO_CHAR(i.start, 'YYYY-MM-DD') AS start,
                TO_CHAR(i."end", 'YYYY-MM-DD') AS "end",
                i.salary AS salary,
                i.mode AS mode,
                i.location AS location,
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


    /**
     * Registers a user application to an internship
     * @param internship_id id of the internship
     * @param user_email email of the students that applies
     * @returns an async Promise containing: Status.error if the query failed,
     * else true if the tuple has been added else false if the tuple was already present
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
            console.log(`[server]: (query error) (apply to internship) ${err}`);
            return Status.error;
        }
    }

    /**
     * Retrieve all student's internships
     * @param student_email user email on which perform the query
     * @returns an async Promise containing: an array of database
     * rows matching the request or an error Status if the query fails
     */
    public async fetch_student_internships(student_email:string) : Promise<Array<any> | Status>  {
        try {
            let internships = await pool.query(
                `
                SELECT title, SI.status
                FROM student_internship as SI join internship on SI.internship_id = internship."id"
                WHERE SI.student_email = '${student_email}'
                ORDER BY (SI.status = 'finished')
                `
            )
            return internships.rows
        } catch (err) {
            console.log(`[server]: (query error) (fetch students internship) ${err}`);
            return Status.error;
        }
    }

    /**
     * Retrieve all company's internships
     * @param company_email user email on which perform the query
     * @returns an async Promise containing: an array of database rows matching the request
     * else an error Status if the query fails
     */
    public async fetch_company_internships(company_email:string) : Promise<Array<any> | Status>  {
        try {
            let internships = await pool.query(
                `
                SELECT 	I.*, C.name AS company, (SELECT count(*) AS applied_students 
				                                 FROM student_internship 
				                                 WHERE internship_id=I.id
				                                ), null as tags
                FROM internship as I join company as C on C.user_email = I.company_email
                WHERE I.company_email = '${company_email}'
                ORDER BY (I.status = 'terminated')
                `
            )
            return internships.rows
        } catch (err) {
            console.log(`[server]: (query error) (fetch company internship) ${err}`);
            return Status.error;
        }
    }

    /**
     * Close internship with passed id
     * @param internship_id internship id to close
     * @returns a Promise containing an ok Status if the internship has been closed
     * else an error Status if the query fails
     */
    public async close_internship(internship_id:string) : Promise<Status> {
        try {
            let result = await pool.query (
                `
                UPDATE internship
                SET status = 'terminated'
                WHERE "id" = ${internship_id} AND
                        status = 'ongoing' AND
                        "end" < to_date('${format_date_for_database(new Date(get_current_datetime()))}', 'YYYY-MM-DD'),
                `
            )
            if(result.rowCount !== 1)
                throw new Error('violated condition: internship status is not "ongoing" OR internship hasn\'t ended yet.')
            return Status.ok
        } catch (err) {
            console.log(`[server]: (query error) (close internship) ${err}`);
            return Status.error;
        }
    }
}