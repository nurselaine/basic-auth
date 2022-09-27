'use strict';

const { start } = require('./src/server');
const { sequelizeDatabase, UserModel } = require('./src/models/index');

sequelizeDatabase.sync()
  .then(() => {
    console.log('successfully connected to DB!');
    // UserModel.create({username: 'test', password: 'test'});
    start();
  })
  .catch(error => console.error('ERROR: ', error.message));