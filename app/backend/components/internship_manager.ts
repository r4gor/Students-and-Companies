import { Status } from "../utils/status";
import pool from "../utils/db_pool";
import { format_date_for_database, get_current_datetime } from "../utils/date_utils";
import {SuggestionManager} from "./suggestion_manager";

type InternshipType = {
    id: number,
    email: string,
    title: string,
    description: string,
    application_end_date: Date,
    start_date: Date,
    end_date: Date
}

type CandidateType = {
    email: string,
    first_name: string,
    last_name: string,
    status: string,
}

type QuestionType = {
    id: number,
    text: string,
}

type ReplyType = {
    id: number,
    answer: string,
}

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

            await new SuggestionManager().suggest_internship_to_students(tags, result.rows[0].id, result.rows[0].title)
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
            RETURNING id, title
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
                SELECT SI.internship_id, title, SI.status, internship.status as internship_status
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
     * Fetches all the accepted candidates email of passed internship
     * @param internship_id target internship
     * @returns a Promise containing an array of strings,
     * else an error status if the query fails
     */
    public async fetch_internship_accepted_candidates(internship_id:string) : Promise<string[] | Status>  {
        try {
            let result = await pool.query(
                `
                SELECT student_email
                FROM student_internship
                WHERE internship_id = $1 AND status = 'accepted'
                `,[internship_id]
            )
            return result.rows.map(tuple => tuple.student_email)
        } catch (err) {
            console.log(`[server]: (query error) (fetch company internship) ${err}`);
            return Status.error;
        }
    }

    /**
     * Close the interview phase of passed internship by changing its status
     * @param internship_id internship to update
     * @returns an async Promise containing: an ok Status if the internship is updated
     * an error Status if an error occurs in the query
     */
    public async close_interview_phase(internship_id:string) : Promise<Status> {
        try {
            let result = await pool.query(
                `
                UPDATE internship
                SET status = 'interview'
                WHERE "id" = $1
                `,
                [internship_id]
            )
            if(result.rowCount !== 1)
                throw new Error('Internship doesn\'t exists')
            return Status.ok
        }
        catch(err) {
            console.log(`[server]: (query error) (close internship) ${err}`);
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

    public async get_internship_name(internship_id:string) : Promise<string | Status>  {
        try {
            let result = await pool.query(
                `
                SELECT title
                FROM internship
                WHERE "id" = $1
                `,[internship_id]
            )
            return result.rows[0].title
        } catch (err) {
            console.log(`[server]: (query error) (fetch company internship) ${err}`);
            return Status.error;
        }
    }
    /**
     * fetch all candididates related to a given internship
     * @param id number uniquely identifying the internship
     * @returns a promise of an array of candidates (as defined by CandidateType)
     * or Status.error if something went wrong during the query
     */
    public async fetch_candidates(id: number): Promise<Status.error | Array<CandidateType>> {
        return await pool.query(`
                SELECT user_email AS email, first_name, last_name, status FROM 
                student JOIN student_internship ON user_email = student_email 
                WHERE internship_id=${id}
                ORDER BY last_name, first_name
            `).then(res => {
            if (res.rowCount === null) {
                console.log(`[server]: (error) inside 'fetch_candidates':\nrowCount == null`);
                return Status.error;
            }
            return res.rows.map((row) => <CandidateType>row);
        }).catch(err => {
            console.log(`[server]: (query error) inside 'fetch_candidates':\n${err}`);
            return Status.error;
        });
    }

    /**
     * fetch the interview questions of a given internship
     * @param id number uniquely identifying the internship
     * @returns a promise of an array of questions (as defined by QuestionType)
     * or Status.error if something went wrong during the query
     */
     public async fetch_interview_questions(id: number): Promise<Status.error | Array<QuestionType>> {
        return await pool.query(`
            SELECT id, question AS text FROM interview_question WHERE internship_id=${id}
            ORDER BY id
        `).then(res => {
            if (res.rowCount === null) {
                console.log(`[server]: (error) inside 'fetch_interview_questions':\nrowCount == null`);
                return Status.error;
            }
            return res.rows.map((row) => <QuestionType>row);
        }).catch(err => {
            console.log(`[server]: (query error) inside 'fetch_interview_questions':\n${err}`);
            return Status.error;
        });
    }

    /**
     * fetch the replies of a candidate related to the form of an internship
     * @param id number uniquely identifying the internship
     * @param email candidate's email
     * @returns a promise of an array of replies (as defined by ReplyType)
     * or Status.error if something went wrong during the query
     */
    public async fetch_candidate_replies(id: number, email: string): Promise<Status.error | Array<ReplyType>> {
        return await pool.query(`
            SELECT id, answer
            FROM interview_question JOIN reply ON id = question_id 
            WHERE internship_id=${id} AND student_email='${email}'
            ORDER BY question_id
        `).then(res => {
            if (res.rowCount === null) {
                console.log(`[server]: (error) inside 'fetch_candidate_replies':\nrowCount == null`);
                return Status.error;
            }
            return res.rows.map((row) => <ReplyType>row);
        }).catch(err => {
            console.log(`[server]: (query error) inside 'fetch_candidate_replies':\n${err}`);
            return Status.error;
        });
    }

    /**
     * fetch the replies of a candidate related to the form of an internship
     * @param id number uniquely identifying the internship
     * @param email candidate's email
     * @param status candidate's status
     * @returns a promise of an array of replies (as defined by ReplyType)
     * or Status.error if something went wrong during the query
     */
    public async set_candidate_status(id: number, email: string, status: string): Promise<Status> {
        return await pool.query(`
            UPDATE student_internship SET status='${status}' 
            WHERE internship_id=${id} AND student_email='${email}'
        `).then(_ => Status.ok)
        .catch(err => {
            console.error(err);
            return Status.error;
        });
    }

    /**
     * fetch the replies of a candidate related to the form of an internship
     * @param email candidate's email
     * @param replies array of replyType about the answers give a the interview form
     * @returns a promise of the result of the query
     */
    public async post_candidate_replies(email: string, replies:Array<ReplyType>): Promise<Status> {
        let query =
        `CREATE TEMPORARY TABLE reply_updates (
            question_id INTEGER NOT NULL,
            student_email VARCHAR(255) NOT NULL,
            answer TEXT NOT NULL
        );\n`
        + replies.map((reply) => `
            INSERT INTO reply_updates (question_id, student_email, answer)
            VALUES (${reply.id}, '${email}', '${reply.answer}');\n
        `).join("")
        + `
            MERGE INTO reply r
            USING reply_updates u
            ON r.question_id = u.question_id AND r.student_email = u.student_email
            WHEN MATCHED THEN 
                UPDATE SET answer = u.answer
            WHEN NOT MATCHED THEN 
                INSERT (question_id, student_email, answer)
                VALUES (u.question_id, u.student_email, u.answer);

            DROP TABLE reply_updates; 
        `;
        console.log(query)
        return await pool.query(query)
        .then(_ => Status.ok)
        .catch(err => {
            console.error(err);
            return Status.error;
        });
    }

    /**
     * Updates an application offer according to passed accepted value
     * @param internship_id target internship
     * @param student_email email of student taking the decision
     * @param accepted set to true if the student accepted, false otherwise
     * @returns a Promise containing an ok Status if the offer is updated
     * else an error Status if the query fails or doesn't update anything
     */
    public async update_offer(internship_id:number, student_email:string, accepted:boolean) : Promise<Status> {
        let decision = accepted ? 'ongoing' : 'rejected_offer'
        try {
            let result = await pool.query (
                `
                UPDATE student_internship
                SET status = $1
                WHERE student_email = $2 AND internship_id = $3
                `,[decision, student_email, internship_id]
            )
            if(result.rowCount !== 1)
                throw new Error('Internship or student doesn\'t exists')
            return Status.ok
        } catch (err) {
            console.log(`[server]: (query error) (update offer) ${err}`);
            return Status.error;
        }
    }
}
