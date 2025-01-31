import { describe } from 'node:test';
import {server, app} from '../../index'
import request from "supertest";
import { randomInt } from 'node:crypto';

let base_url = '/api/sign_up/'

describe('Fetch universities', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    test('successful test (no input other than url)', async () => {
        let api_result = await request(app).get(base_url + 'get_universities');
        expect(api_result.status).toBe(200);
    })
})

describe('Create account', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'create_account';

    test('email already in use', async () => {
        let payload = {
            email:'company1@example.com', 
            userType:'c', 
            university:'', 
            password:'pass123'
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(400);
    }) 

    test('invalid university', async () => {
        let rnd_int = randomInt(1_000) + 100;
        let payload = {
            email:`student${rnd_int}@test.com`, 
            userType:'s', 
            university:'invalid-university', 
            password:'pass123'
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(500);
    }) 

    test('missing password', async () => {
        let rnd_int = randomInt(1_000) + 100;
        let payload = {
            email:`company${rnd_int}@test.com`, 
            userType:'c', 
            university:'', 
            password:undefined
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(500);
    }) 

    test('successful test (signup as univeristy)', async () => {
        let rnd_int = randomInt(1_000) + 100;
        let payload = {
            email:`university${rnd_int}@test.com`, 
            userType:'u', 
            university:'', 
            password:'pass123'
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    }) 

    test('successful test (signup as company)', async () => {
        let rnd_int = randomInt(1_000) + 100;
        let payload = {
            email:`company${rnd_int}@test.com`, 
            userType:'c', 
            university:'', 
            password:'pass123'
        };
        let api_result = await request(app)
            .post(url)
            .send(payload)
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    }) 
})

