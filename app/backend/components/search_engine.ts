import pool from "../utils/db_pool";
import { Status } from "../utils/status";

export class SearchEngine {

	/**
	 * Return a list of internship information that respect the set of given parameters 
	 * @param text textual query input
	 * @param orderby results can be ordered by 'relevance', 'salary' or 'duration'
	 * @param ascending if set to true the results are to be sorted in ascending order, else descending
	 * @param salary minimum salary admitted
	 * @param duration maximum duration admitted
	 * @param mode filter on type of presence modality, can be "presence", "remote" or "mixed"
	 * @param tags list of keywords
	 * @returns an Array of tuples representing internships matching the parameters or an error Status if the query fails
	 */
	public async get_internships (
		text: string,
		orderby: string,
		ascending: boolean,
		salary: number,
		duration: number,
		mode: string,
		tags: string[]
	) : Promise<Array<any> | Status> {
		try {
			let result: InternshipQueryResult[] = []
			let internships = await pool.query (
				`
				SELECT I.*, string_agg(T.description, ' ') AS tags, C.name AS company
				FROM internship as I join tag_internship on I.id=tag_internship.internship_id join tag as T on tag_id=T.id join company as C on C.user_email = I.company_email
				GROUP BY I.id, company_email, title, I.description, start, "end", published, application_end, status, C.name
				`
			)
			internships.rows.forEach(row => {
				row.salary = 0
				row.mode = 'mixed'
				result.push(row)
			})
			return result 
		} catch (err) {
			console.log(`[server]: (query error) (create internship) ${err}`);
            return Status.error;
		}
	}
}

type InternshipQueryResult = {
	id: string
	company: string
	title: string
	description: string
	start: string
	end: string
	published: string
	application_end: string
	salary: string
	mode: string
	tags: string[]
}