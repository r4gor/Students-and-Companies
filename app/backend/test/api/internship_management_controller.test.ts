import {server, app} from '../../index'
import request from "supertest";

let base_url = '/api/internship_management/'

describe('Apply to internship', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'apply_to_internship/'
    test('Bad request if missing parameters', async () => {
        let parameters = {
            internship_id: 1
        }
        let api_result = await request(app).post(url).query(parameters);
        expect(api_result.status).toBe(400)
    })

    test('Fail if application present', async () => {
        let parameters = {
            internship_id: 1,
            user_email: 'student1@example.com'
        }
        let api_result = await request(app).post(url).query(parameters);
        expect(api_result.status).toBe(409)
    })
})

describe('Fetch students application', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'fetch_student_internships/'
    test('Bad request if missing parameters', async () => {
        let api_result = await request(app).get(url);
        expect(api_result.status).toBe(400)
    })

    test('Contains correct fields if successful', async () => {
        let parameters = {
            user: 'student1@example.com'
        }
        let api_result = await request(app).get(url).query(parameters);
        expect(api_result.status).toBe(200)
        expect(api_result.body[0]).toHaveProperty("internship_id");
        expect(api_result.body[0]).toHaveProperty("title");
        expect(api_result.body[0]).toHaveProperty("status");
        expect(api_result.body[0]).toHaveProperty("internship_status");
    })
})

describe('Fetch company internships', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'fetch_company_internships/'
    test('Bad request if missing parameters', async () => {
        let api_result = await request(app).get(url);
        expect(api_result.status).toBe(400)
    })
})

describe('Update offer', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'update_offer/'
    test('Bad request if missing parameters', async () => {
        let api_result = await request(app).post(url);
        expect(api_result.status).toBe(400)
    })
})

describe('Close interview phase', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'close_interview_phase/'
    test('Bad request if missing parameters', async () => {
        let api_result = await request(app).get(url);
        expect(api_result.status).toBe(400)
    })

    test('Server error if internship not in the correct state', async () => {
        let parameters = {
            id: 2,
            user_email: ' '
        }
        let api_result = await request(app).get(url).query(parameters);
        expect(api_result.status).toBe(400)
        expect(api_result.body.message).toBe('Internal server error')
    })
})

describe('Close internship', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'close_internship/'
    test('Bad request if missing parameters', async () => {
        let api_result = await request(app).get(url);
        expect(api_result.status).toBe(400)
    })
})