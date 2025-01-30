import {server, app} from '../../index'
import request from "supertest";

let base_url = '/api/internship_browsing/search_internships/'

describe('Query', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'query/'
    test('Bad request if missing parameters', async () => {
        let parameters = {
            user: '',
            text: '',
            ascending: '0',
            salary: '0',
            duration: '1',
            mode: 'presence',
            tags: '',
        }
        let api_result = await request(app).get(url).query(parameters);
        expect(api_result.status).toBe(400)
    })

    test('Fail if orderby is invalid', async () => {
        let parameters = {
            user: '',
            text: '',
            orderby: 'RANDOM',
            ascending: '0',
            salary: '0',
            duration: '1',
            mode: 'presence',
            tags: '',
        }
        let api_result = await request(app).get(url).query(parameters);
        expect(api_result.status).toBe(400)
    })

    test('Fail if mode is invalid', async () => {
        let parameters = {
            user: '',
            text: '',
            orderby: 'salary',
            ascending: '0',
            salary: '0',
            duration: '1',
            mode: 'RANDOM',
            tags: '',
        }
        let api_result = await request(app).get(url).query(parameters);
        expect(api_result.status).toBe(400)
    })

    test('Returns database rows if correct params', async () => {
        let parameters = {
            user: '',
            text: '',
            orderby: 'salary',
            ascending: '0',
            salary: '0',
            duration: '1',
            mode: 'all',
            tags: '',
        }
        let api_result = await request(app).get(url).query(parameters);
        expect(api_result.status).toBe(200)
        expect(api_result.body.length).toBeGreaterThan(0)
    })
})