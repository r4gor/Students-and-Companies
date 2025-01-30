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
        expect(api_result.body[0]).toHaveProperty('id')
        expect(api_result.body[0]).toHaveProperty('company')
        expect(api_result.body[0]).toHaveProperty('title')
        expect(api_result.body[0]).toHaveProperty('description')
        expect(api_result.body[0]).toHaveProperty('start')
        expect(api_result.body[0]).toHaveProperty('end')
        expect(api_result.body[0]).toHaveProperty('published')
        expect(api_result.body[0]).toHaveProperty('application_end')
        expect(api_result.body[0]).toHaveProperty('salary')
        expect(api_result.body[0]).toHaveProperty('mode')
        expect(api_result.body[0]).toHaveProperty('location')
        expect(api_result.body[0]).toHaveProperty('tags')
        expect(api_result.body[0]).toHaveProperty('applied_students')
    })
})

describe('Tags', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'tags/'
    test('Return array of object with correct fields', async () => {
        let api_result = await request(app).get(url);
        expect(api_result.body.rows[0]).toHaveProperty('description')
    })
})