import pool from "../utils/db_pool";
import { Status } from "../utils/status";

export class SearchEngine {
	public static order_by_valid_values: string[] = ["posted", "salary", "duration"]
	public static mode_valid_values: string[] = ["presence", "remote", "mixed"]
	private order_by_map = {
		'posted': 'I.published',
		'salary': 'I.salary',
		'duration': 'I."end" - I.start'
	}
	/**
	 * TODO: filter by text, salary, duration, mode
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
	) : Promise<Array<InternshipQueryResult> | Status> {
		
		try {
			let result: InternshipQueryResult[] = []
			let internships = await pool.query (
				`
				SELECT I.*, string_agg(T.description, ' ') AS tags, C.name AS company, (SELECT count(*) AS applied_students FROM student_internship WHERE status='applied' and internship_id=I.id)
				FROM internship as I left join tag_internship on I.id=tag_internship.internship_id left join tag as T on tag_id=T.id join company as C on C.user_email = I.company_email
				${tags.length ? 'WHERE I.id in (SELECT internship_id from internship I1 join tag_internship on I1.id=tag_internship.internship_id join tag as T1 on tag_id=T1.id WHERE T1.description in '+this.array_to_sql_list(tags)+')' : ''}
				GROUP BY I.id, I.company_email, I.title, I.description, I.start, I."end", I.published, I.application_end, I.status, C.name
				HAVING date_part('month', AGE(I."end", I.start)) > ${duration}
				ORDER BY ${this.order_by_map[orderby as keyof typeof this.order_by_map]} ${ascending ? 'ASC' : 'DESC'}
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
	private array_to_sql_list(array:Array<any>):string {
		let res = '('
		array.forEach(element => {
			res += `'${element}'`
		});
		return res + ')'
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
	tags: string
	applied_students: string
}