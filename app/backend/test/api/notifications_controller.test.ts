import {server, app} from '../../index'
import request from "supertest";

let base_url = '/api/notifications/'

describe('Fetch notifications', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'fetch/';

    test('Bad request if missing email', async () => {
        let api_result = await request(app).get(url);
        expect(api_result.status).toBe(404);
    })

    test('Successful fetch', async () => {
        let api_result = await request(app).get(url + "tester_email@email.com");
        expect(api_result.status).toBe(200);
    })
})

describe('Set notifications as read', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'mark_as_read/';

    test('Bad request if missing body', async () => {
        let api_result = await request(app).post(url).send(undefined);
        expect(api_result.status).toBe(400);
    })
    
    test('Bad request if missing body field (id)', async () => {
        let api_result = await request(app).post(url).send({});
        expect(api_result.status).toBe(400);
    })
    
    test('Successful test', async () => {
        let api_result = await request(app)
            .post(url)
            .send({ id: 1 })
            .set('Content-Type', 'application/json');
        expect(api_result.status).toBe(200);
    })
})

describe('Post notification', () => {
    afterAll(() => {
        server.closeIdleConnections()
        server.closeAllConnections()
        server.close()
    })

    let url = base_url + 'post/';

    test('Bad request if missing body', async () => {
        let api_result = await request(app).post(url).send(undefined);
        expect(api_result.status).toBe(400);
    })

    test('Bad request if body field does not have the expected type 1', async () => {
        let api_result = await request(app).post(url).send({ receivers: undefined });
        expect(api_result.status).toBe(400);
    })

    test('Bad request if body field does not have the expected type 2', async () => {
        let api_result = await request(app).post(url).send({ 
            receivers: ['r1'], 
            sender: 1, 
            title: "title", 
            body: "body" 
        });
        expect(api_result.status).toBe(400);
    })
    
    test('Bad request if body field does not have the expected type 3', async () => {
        let api_result = await request(app).post(url).send({ 
            receivers: ['r1'], 
            sender: "sender", 
            title: undefined, 
            body: "body" 
        });
        expect(api_result.status).toBe(400);
    })
    
    test('Bad request if body field does not have the expected type 4', async () => {
        let api_result = await request(app).post(url).send({ 
            receivers: ['r1'], 
            sender: "sender", 
            title: "title", 
            body: undefined 
        });
        expect(api_result.status).toBe(400);
    })
})
