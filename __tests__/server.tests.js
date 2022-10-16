'use strict';

const { app } = require('../src/server');
const { sequelizeDatabase } = require('../src/models/index');
const supertest = require('supertest');
const basicAuth = require('../src/middleware/basicAuth');
const mockRequest = supertest(app);

let userData = {
  testUser: { username: 'user', password: 'password' },
};

beforeAll( async () => {
  await sequelizeDatabase.sync();
});

afterAll( async () => {
  await sequelizeDatabase.drop();
});

describe('Auth Tests', () => {
  test('allows a user to sign up with a POST request', async () => {
    const mock = jest.fn();
    let response = await mockRequest.post('/signup').send({
      username: 'tester',
      password: 'pass123',
    });

    expect(response.body.password).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body.username).toEqual('tester');
    expect(response.body.password).not.toEqual('pass123');
  });

  test('handles a bad user sign up', async () => {
    const mock = jest.fn();
    let response = await mockRequest.post('/signup').send({
      password: ''
    });

    expect(response.status).toBe(400);
    // expect(response.body).toEqual('sign up error occured');
  });

  test('handles an incorrect user signin with a POST request', async () => {
    const req = {
      headers: {
        authorization: 'Basic banana', //'Basic dGVzdDp0ZXN0'
      },
    };
    // const token = {'Authorization': 'Basic dGVzdDp0ZXN0'}; this is wrong
    let res = {};
    let next = jest.fn(); // must mock jest function (heck 1hr into lecture)
    basicAuth(req, res, next)
      .then(() => {
        expect(next).toHaveBeenCalledWith('Not Authorized');
      }); // looking into the .next funciton 
  });

  test('handles a user signin with a POST request', async () => {
    const req = {
      headers: {
        authorization: 'Basic banana', //'Basic dGVzdDp0ZXN0'
      },
    };
    // const token = {'Authorization': 'Basic dGVzdDp0ZXN0'}; this is wrong
    let res = {};
    let next = jest.fn(); // must mock jest function (heck 1hr into lecture)
    basicAuth(req, res, next)
      .then(() => {
        expect(next).toHaveBeenCalled();
      }); // looking into the .next funciton 
  });

});