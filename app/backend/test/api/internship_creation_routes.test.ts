import {server, app} from '../../index'
import request from "supertest";

let base_url = '/api/internship_creation/create_internship/'

describe('Create internship', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    test('Bad request if end date past start date', async () => {
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
            tags: '',
            questions: 'test'
        }
        let api_result = await request(app).post(base_url).query(parameters)
        expect(api_result.status).toBe(400)
    })

    test('Bad request if any missing parameters', async () => {
        let parameters = {
            email: 'test_email',
            title: 'test internship',
            application_end_date: new Date(2024,3,1),
            start_date: new Date(2024,4,1),
            end_date: new Date(2024,6,1),
            salary: 0,
            mode: 'presence',
            location: 'test',
            tags: '',
            questions: 'test'
        }
        let api_result = await request(app).post(base_url).query(parameters);
        expect(api_result.status).toBe(400)
    })

    test('Success if all parameters and correct dates', async () => {
        let parameters = {
            email: 'test_email@email.com',
            title: 'test internship',
            description: 'test description',
            application_end_date: new Date(2024,3,1),
            start_date: new Date(2024,4,1),
            end_date: new Date(2024,6,1),
            salary: 0,
            mode: 'presence',
            location: 'test',
            tags: '',
            questions: 'test'
        }
        let api_result = await request(app).post(base_url).query(parameters);
        expect(api_result.status).toBe(200)
    })
})