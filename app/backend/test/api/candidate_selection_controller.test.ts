import { describe } from 'node:test';
import {server, app} from '../../index'
import request from "supertest";

let base_url = '/api/candidates_selection/'

describe('Fetch candidates', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'fetch/candidates/';

    test('test missing url parameter', async () => {
        let api_result = await request(app).get(url);
        expect(api_result.status).toBe(404);
    })

    test('successful test', async () => {
        let api_result = await request(app).get(url + '1');
        expect(api_result.status).toBe(200);
    })
})

describe('Fetch interview questions', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'fetch/questions/';

    test('test missing url parameter', async () => {
        let api_result = await request(app).get(url);
        expect(api_result.status).toBe(404);
    })

    test('successful test', async () => {
        let api_result = await request(app).get(url + '1');
        expect(api_result.status).toBe(200);
    })
})

describe('Post candidate state', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'post/status';

    test('test missing body', async () => {
        let api_result = await request(app).post(url)
        expect(api_result.status).toBe(400);
    })

    test('test missing body parameter (id)', async () => {
        let payload = {
            id: undefined,
            email: 'student1@example.com',
            status: 'accepted',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('test missing body parameter (email)', async () => {
        let payload = {
            id: 1,
            email: undefined,
            status: 'accepted',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('test missing body parameter (status)', async () => {
        let payload = {
            id: 1,
            email: 'student1@example.com',
            status: undefined,
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('successful test', async () => {
        let payload = {
            id: 1,
            email: 'student1@example.com',
            status: 'applied',
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    })
})

describe('Post candidate replies', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'post/replies';

    test('test missing body', async () => {
        let api_result = await request(app).post(url)
        expect(api_result.status).toBe(400);
    })

    test('test missing body parameter (email)', async () => {
        let payload = {
            email: undefined,
            replies: [],
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('successful test', async () => {
        let payload = {
            email: 'student1@example.com',
            replies: [{id:1, answer:'42'}, {id:2, answer:'42'}],
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    })
})
