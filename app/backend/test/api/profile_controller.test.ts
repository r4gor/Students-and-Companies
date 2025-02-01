import { before, describe } from 'node:test';
import {server, app} from '../../index'
import request from "supertest";

let base_url = '/api/profile/'

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

describe('Fetch user tags', () => {
    let url = base_url + 'get_user_tags/';

    test('[Fetch user tags] missing body field (email)', async () => {
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

    test('[Fetch user tags] invalid email', async () => {
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

    test('[Fetch user tags] valid email', async () => {
        let payload = {
            userEmail: 'company1@example.com',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
        expect((api_result.body as any[]).length).toBeGreaterThan(0);
    })
})

describe('Add tag to user profile', () => {
    let url = base_url + 'add_tag_to_user/';

    test('[Add tag to user profile] missing email', async () => {
        let payload = {
            tag: 'tag-test',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('[Add tag to user profile] missing tag', async () => {
        let payload = {
            userEmail: 'company1@example.com',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('[Add tag to user profile] invalid email', async () => {
        let payload = {
            userEmail: 'nomail@test.com',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('[Add tag to user profile] successful test', async () => {
        let payload = {
            userEmail: 'tester_email@email.com',
            tag: 'test-tag'
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    })
})

describe('Remove tag from user profile', () => {
    before(async () => {
        let payload = {
            userEmail: 'tester_email@email.com',
            tag: 'test-tag-to-remove'
        };
        let api_result = await request(app)
            .post(base_url + 'add_tag_to_user/')
            .send(payload)
            .set('Content-Type', 'application/json');
    })

    let url = base_url + 'remove_tag_from_user/';

    test('[Remove tag from user profile] missing email', async () => {
        let payload = {
            tag: 'tag-test',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('[Remove tag from user profile] missing tag', async () => {
        let payload = {
            userEmail: 'company1@example.com',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('[Remove tag from user profile] invalid email', async () => {
        let payload = {
            userEmail: 'nomail@test.com',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('[Remove tag from user profile] successful test', async () => {
        let payload = {
            userEmail: 'tester_email@email.com',
            tag: 'test-tag-to-remove'
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    })
})

describe('Fetch user CV', () => {
    let url = base_url + 'get_cv/';

    test('[Fetch user CV] missing body field (email)', async () => {
        let payload = {
            userEmail: undefined,
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
        expect(JSON.stringify(api_result.body)).toBe('{}');
    })

    test('[Fetch user CV] invalid email', async () => {
        let payload = {
            userEmail: '42@anything.com',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
        expect(JSON.stringify(api_result.body)).toBe('{}');
    })
})

describe('Fetch company internship', () => {
    let url = base_url + 'get_company_internships/';

    test('[Fetch company internship] missing body field (email)', async () => {
        let payload = {
            userEmail: undefined,
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
        expect(JSON.stringify(api_result.body)).toBe('[]');
    })

    test('[Fetch company internship] invalid email', async () => {
        let payload = {
            userEmail: '42@anything.com',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
        expect(JSON.stringify(api_result.body)).toBe('[]');
    })
})
