import { describe } from 'node:test';
import {server, app} from '../../index'
import request from "supertest";

let base_url = '/api/feedbacks/';

describe('Fetch feedbacks\' questions', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + "fetch/questions";

    test('Bad request if missing body', async () => {
        let api_result = await request(app).post(url).send(undefined);
        expect(api_result.status).toBe(400)
    })

    test('Bad request if missing body parameter', async () => {
        let api_result = await request(app)
            .post(url)
            .send({})
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400)
    })
    
    test('Successful request', async () => {
        let payload = { 
            user_type: 's'
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200)
    })
})

describe('Post feedback', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + "post";

    test('Bad request if missing body', async () => {
        let api_result = await request(app).post(url).send(undefined);
        expect(api_result.status).toBe(400)
    })

    test('Bad request if missing feedbacks inside body', async () => {
        let api_result = await request(app)
            .post(url)
            .send({})
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400)
    })
    
    test('Successful request', async () => {
        let payload = { feedbacks: [
            {
                question_id: 1,
                internship_id: 1,
                user_email: 'tester_email@email.com',
                rating: 2
            },
            {
                question_id: 2,
                internship_id: 1,
                user_email: 'tester_email@email.com',
                rating: 3
            },
            {
                question_id: 3,
                internship_id: 1,
                user_email: 'tester_email@email.com',
                rating: 4
            },
            {
                question_id: 4,
                internship_id: 1,
                user_email: 'tester_email@email.com',
                rating: 5
            }
        ]};
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200)
    })
})
