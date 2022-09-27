'use strict';

const { app } = require('../src/server');
const { sequelizeDatabase } = require('../src/models/index');
const supertest = require('supertest');
const request = supertest(app);

beforeAll( async () => {
  await sequelizeDatabase.sync();
});

afterAll( async () => {
  await sequelizeDatabase.drop();
});

describe('Auth Tests', () => {
  test('allows a user to sign up with a POST request', async () => {
    let response = await request.post('/signup').send({
      username: 'tester',
      password: 'pass123',
    });
    // console.log(`password ${JSON.stringify(response)}`);
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body.username).toEqual('tester');
    expect(response.body.password).toBeTruthy();
  });

  test('handles an incorrect user signin with a POST request', async () => {
    const token = {'Authorization': 'Basic dGVzdDp0ZXN0'};
    let response = await request.post('/signin').set(token);
    console.log(response);
    expect(response.status).toBe(200);
    expect(response.body.username).toEqual('test');
    expect(response.body.password).toBeTruthy();
  });

  // test('Tests whether provided username belongs in database', async () => {
  //   const token = {'Authorization': 'Basic dGVzdDp0ZXN0'};
  //   let response = await request.post('/signin').set(token);

  //   expect(response.status).toBe(200);
  //   expect(next).toHaveBeenCalled();
  // })
})