let base_url = 'http://localhost:4000/api/internship_creation/create_internship'

describe('Create internship', () =>{
    test('Bad request if end date past start date', async () => {
        let url = new URL(base_url)
        let parameters = {
            email: 'test_email',
            title: 'test internship',
            description: 'test description',
            application_end_date: new Date(2024,3,1),
            start_date: new Date(2024,6,1),
            end_date: new Date(2024,6,1),
            salary: 0,
            mode: 'presence',
            location: 'test',
            tags: ''
        }
        url.search = format_search_params(parameters)
        let api_result = await fetch(url, {
            method: "POST"
        })
        expect(api_result.status).toBe(400)
    })
})

function format_search_params(parameters:Object) {
    let search_params = new URLSearchParams()
    Object.entries(parameters).forEach(([key, value]: [any,any]) => {
        search_params.append(key, value);
    });
    return search_params.toString()
}