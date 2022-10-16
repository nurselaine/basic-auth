'use strict';

const supertest = require('supertest');
const { app } = require('../src/server');
const basicAuth = require('../src/middleware/basicAuth');
const { sequelizeDatabase, UserModel } = require('../src/models/index');
const mockRequest = supertest(app);

let user = {
  username: "elaine",
  password: "1234",
};

beforeAll( async () => {
  await sequelizeDatabase.sync();
  await UserModel.create(user);
});

afterAll( async () => {
  await sequelizeDatabase.drop();
});

describe('basic auth middleware tests', () => {
  test('handles an incorrect user signin with a POST request', async () => {
    const req = {
      headers: {
        authorization: 'Basic incorrectString', //'Basic dGVzdDp0ZXN0'
      },
    };

    let res = {};
    let next = jest.fn(); // must mock jest function (heck 1hr into lecture)
    basicAuth(req, res, next)
      .then(() => {
        expect(next).toHaveBeenCalled();
      }); // looking into the .next funciton 
  });
});