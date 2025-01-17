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
		return []
	}
}