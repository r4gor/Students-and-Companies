import {server, app} from '../../index'
import request from "supertest";

let base_url = '/api/complaints/'

describe('Post Complaints', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'post/'
    test('Fails if missing parameters', async () => {
        let parameters = {
            email: '',
            description: ''
        }
        let api_result = await request(app).post(url).query(parameters);
        expect(api_result.status).toBe(400)
    })
})

describe('Get Complaints', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'get/'
    test('Fails if missing parameters', async () => {
        let parameters = {}
        let api_result = await request(app).get(url).query(parameters);
        expect(api_result.status).toBe(400)
    })

    test('Returns an array if correct parameters', async () => {
        let parameters = {
            email: 'university1@email.com'
        }
        let api_result = await request(app).get(url).query(parameters);
        expect(api_result.status).toBe(200)
        expect(api_result.body).not.toBeUndefined()
    })
})