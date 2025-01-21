export async function get_internship_list_http_query_no_filters (text: string) : Promise<Array<any>> {
    let parameters = {
        text: text,
        orderby: 'posted',
        ascending: '1',
        salary: '0',
        duration: '1',
        mode: 'mixed',
        tags: []
    }
    return (await fetch_internship_list(parameters)).json()
}

export async function get_internship_list_http_query (
    text: string,
    orderby: string,
    ascending: string,
    salary: string,
    duration: string,
    mode: string,
    tags: string[]
) {
    return (await fetch_internship_list({text,orderby,ascending,salary,duration,mode,tags})).json()
}

async function fetch_internship_list(parameters: Object): Promise<Response> {
    let url = new URL('http://localhost:4000/api/internship_browsing/search_internships/query/')
    url.search = format_search_parameters(parameters)
    return fetch(url, {
        method: "GET"
    });
}

/**
 * Converts a set of parameters into a URL query
 * @param parameters parameters Object to be converted
 * @param allow_empty default to true, allows to pass empty parameters (such as empty strings)
 * @returns string that contains all parameters formatted as a URL query
 */
function format_search_parameters(parameters: Object, allow_empty:boolean=true) : string {
    let search_params: URLSearchParams = new URLSearchParams();
    Object.entries(parameters).forEach(([key, value]: [any,any]) => {
        if (!!value || allow_empty) {
            search_params.append(key, value);
        }
    });
    return search_params.toString();
} 

export async function fetch_all_tags() {
    let url = new URL('http://localhost:4000/api/internship_browsing/search_internships/tags/')
    return fetch(url, {
        method: "GET"
    });
}