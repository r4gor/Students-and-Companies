import { QueryResult } from "pg";
import pool from "../utils/db_pool";
import { Status } from "../utils/status";
import { ThirdPartyDataAnalyzer } from "./third_party_data_analyzer";

export class SearchEngine {
	public static order_by_valid_values: string[] = ["posted", "salary", "duration"]
	public static mode_valid_values: string[] = ["all", "presence", "remote", "mixed"]
	private order_by_map = {
		'posted': 'I.published',
		'salary': 'I.salary',
		'duration': 'I."end" - I.start'
	}
	private mode_map = {
		"all": "'presence', 'remote', 'mixed'",
		"presence": "'presence'",
		"remote": "'remote'",
		"mixed": "'mixed'"
	}

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
		query_params: SearchQueryParams
	) : Promise<Array<InternshipQueryResult> | Status> {
		try {
			let internships = await pool.query (
				`
				SELECT 	I.id, I.company_email, I.title, I.description, to_char(I.start, 'YYYY-MM-DD') as start, to_char(I."end", 'YYYY-MM-DD') as "end", to_char(I.published, 'YYYY-MM-DD') as published, to_char(I.application_end, 'YYYY-MM-DD') as application_end, I.status, I.salary, I.mode, I.location,
						string_agg(T.description, ' ') AS tags, 
						C.name AS company, 
						(SELECT count(*) AS applied_students 
						 FROM student_internship 
						 WHERE status='applied' AND internship_id=I.id
						)
				FROM internship as I left join tag_internship on I.id=tag_internship.internship_id 
									left join tag as T on tag_id=T.id 
									join company as C on C.user_email = I.company_email
				WHERE I.id NOT IN (SELECT internship_id FROM student_internship WHERE student_email = '${query_params.user}') AND "status" = 'application'
				${query_params.tags.length ? 'AND I.id IN (SELECT internship_id from internship I1 join tag_internship on I1.id=tag_internship.internship_id join tag as T1 on tag_id=T1.id WHERE T1.description in '+this.array_to_sql_list(query_params.tags)+')' : ''}
				GROUP BY I.id, C.name
				HAVING 	date_part('month', AGE(I."end", I.start)) >= ${query_params.duration} 
						AND I.salary >= ${query_params.salary} 
						AND I.mode in (${this.mode_map[query_params.mode as keyof typeof this.mode_map]}) 
						AND (LOWER(I.title) LIKE '${this.likeable_text(query_params.text)}' OR LOWER(I.description) LIKE '${this.likeable_text(query_params.text)}')
				ORDER BY ${this.order_by_map[query_params.orderby as keyof typeof this.order_by_map]} ${query_params.ascending ? 'ASC' : 'DESC'}
				`
			)
			ThirdPartyDataAnalyzer.produce_search_recommendations(internships.rows, query_params.user);
			return internships.rows as InternshipQueryResult[] 
		} catch (err) {
			console.log(`[server]: (query error) (create internship) ${err}`);
            return Status.error;
		}
	}

	public async get_all_tags() : Promise<QueryResult<any> | Status> {
		try {
			return await pool.query (
				`
				SELECT description
				FROM tag
				`
			)
		} catch (err) {
			console.log(`[server]: (query error) (create internship) ${err}`);
            return Status.error;
		}
	}

	private array_to_sql_list(array:Array<any>):string {
		let res = '('
		array.forEach(element => {
			res += `'${element}',`
		});
		return res.slice(0,-1) + ')'
	}

	private likeable_text(text:string):string {
		return '%'+text.split(' ').join('%')+'%'
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
	location: string
	tags: string
	applied_students: string
}

export type SearchQueryParams = {
	user: string,
	text: string,
	orderby: string,
	ascending: boolean,
	salary: number,
	duration: number,
	mode: string,
	tags: string[]
}