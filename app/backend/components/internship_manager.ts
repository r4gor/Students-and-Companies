import { Status } from "../utils/status";
import pool from "../utils/db_pool";
import { format_date_for_database, get_current_datetime } from "../utils/date_utils";

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
     * fetch all internships of a given company
     * @param email Company email
     * @returns a promise of an array of internships (as defined in InternshipType) 
     * or Status.error if something went wrong during the fetch
     */
    public async fetch_company_internships(email: string): Promise<Status.error | Array<InternshipType>> {
        return await pool.query(`SELECT * FROM Internship WHERE company_email='${email}'`)
        .then(res => {
            if (res.rowCount === null) {
                console.log(`[server]: (error) inside 'fetch_company_internships':\nrowCount == null`);
                return Status.error;
            }
            return res.rows.map((row) => <InternshipType>row);
        })
        .catch(err => {
            console.log(`[server]: (query error) inside 'fetch_company_internships':\n${err}`);
            return Status.error;
        });
    }

    /**
     * fetch all candididates related to a given internship
     * @param id number uniquely identifying the internship
     * @returns a promise of an array of candidates (as defined by CandidateType) 
     * or Status.error if something went wrong during the fetch
     */
    public async fetch_candidates(id: number): Promise<Status.error | Array<CandidateType>> {
        return await pool.query(`
                SELECT user_email AS email, first_name, last_name, status FROM 
                student JOIN student_internship ON user_email = student_email 
                WHERE internship_id=${id}
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
     * or Status.error if something went wrong during the fetch
     */
    public async fetch_interview_questions(id: number): Promise<Status.error | Array<QuestionType>> {
        return await pool.query(`
            SELECT id, question FROM interview_question WHERE internship_id=${id}
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
     * or Status.error if something went wrong during the fetch
     */
    public async fetch_candidate_replies(id: number, email: string): Promise<Status.error | Array<ReplyType>> {
        return await pool.query(`
            SELECT question_id, answer
            FROM interview_question JOIN reply ON id = question_id 
            WHERE internship_id=${id} AND student_email = ${email}
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
     * or Status.error if something went wrong during the fetch
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
}
