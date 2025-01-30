import { describe } from 'node:test';
import {server, app} from '../../index'
import request from "supertest";

let url = '/api/sign_in/'

describe('signin', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    test('test missing request body', async () => {
        let api_result = await request(app).post(url);
        expect(api_result.status).toBe(400);
    })

    test('test missing credentials (email)', async () => {
        let payload = { password: "pass123" };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('test missing credentials (password)', async () => {
        let payload = { email: "student1@example.com" };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    })

    test('test bad credentials (password)', async () => {
        let payload = { email: "student1@example.com", password: "" };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(401);
    })

    test('test bad credentials (email)', async () => {
        let payload = { email: "nomail@example.com", password: "pass123" };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(401);
    })

    test('Successful login', async () => {
        let payload = { email: "student1@example.com", password: "pass123" };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    })
}) 

