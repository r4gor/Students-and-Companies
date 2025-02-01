import { before, describe } from 'node:test';
import {server, app} from '../../index'
import request from "supertest";

let base_url = '/api/edit_profile/'

afterAll(() => {
    server.closeIdleConnections()
    server.closeAllConnections()
    server.close()
}, 10_000)

describe('Fetch user profile', () => {
    let url = base_url + 'get_user_profile/';

    test('[Fetch user profile] missing body field (email)', async () => {
        let payload = {
            userEmail: undefined,
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
        expect((api_result.body as any[]).length).toBe(0);
    })

    test('[Fetch user profile] invalid email', async () => {
        let payload = {
            userEmail: '42@anything.com',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
        expect((api_result.body as any[]).length).toBe(0);
    })

    test('[Fetch user profile] valid email', async () => {
        let payload = {
            userEmail: 'company1@example.com',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
        expect((api_result.body as any[]).length).toBe(1);
    })
})

describe('Update profile', () => {
    let url = base_url + 'update_profile/';

    test('[Update profile] missing data', async () => {
        let api_result = await request(app).post(url)
        expect(api_result.status).toBe(400);
    })

    test('[Update profile] missing user type', async () => {
        let payload = {
            userType: undefined,
            UserEmail: ''
        }
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('[Update profile] valid update (as company)', async () => {
        let payload = {
            userType: 'c',
            UserEmail: 'tester_email@email.com',
            name: 'test&Go',
            address: 'tested-address',
            website: 'website.com',
            phoneNumber: 1123581321,
        }
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    })

    test('[Update profile] valid update (as university)', async () => {
        let payload = {
            userType: 'u',
            UserEmail: 'university742@test.com',
            name: 'localversity',
            address: '42',
            website: '42',
            phoneNumber: 1123581321,
        }
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    })

    test('[Update profile] valid update (as university)', async () => {
        let payload = {
            userType: 's',
            UserEmail: 'student553@test.com',
            firstName: 'John',
            lastName: 'Doe',
            address: '42',
            website: '42',
            phoneNumber: 1123581321,
        }
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    })
})
