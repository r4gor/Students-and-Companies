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
     * @returns Status.ok if the internship has been created successfully, 
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
            console.dir(result.rows[0].id)
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
            WHERE description in (${this.format_tag_list(tags)});
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
                    ${mode},
                    ${location})
            RETURNING id
            `
        );
    }
}