const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
    test('returns HTTP 200', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
    });

    test('returns the expected response body', async () => {
        const response = await request(app).get('/');

        expect(response.text).toBe('Hello World!');
    });
});
