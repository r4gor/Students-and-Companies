export async function get_internship_list_http_query_no_filters (text: string) : Promise<Response> {
    let parameters = {
        text: text,
        orderby: 'relevance',
        ascending: '1',
        salary: '0',
        duration: '1',
        mode: 'mixed',
        tags: []
    }
    return fetch_list(parameters)
}

async function fetch_list(parameters: Object) {
    let url = new URL('https://localhost:4000/api/internship_browsing/search_internships')
    url.search = format_search_parameters(parameters)
    console.log(url)
    return fetch(url, {
        method: "GET"
    });
}

function safe_parse_element(select_element: HTMLSelectElement, default_value: string) {
    let safe_value: string = default_value
    try {
        safe_value = select_element.value
    } catch (error) {}
    return safe_value
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