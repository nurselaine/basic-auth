'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const usersSchema = require('./Users.schema');

// const DATABASE_URL = process.env.DATABASE_URL;

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite::memory'
  : process.env.DATABASE_URL;

let options = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: true,
    rejectUnauthorized: false,
  },
} : {};

const sequelizeDatabase = new Sequelize(DATABASE_URL, options);

// const UserModel = usersSchema(sequelizeDatabase, DataTypes);

const UserModel = usersSchema(sequelizeDatabase, DataTypes);

module.exports = {
  sequelizeDatabase,
  DataTypes,
  UserModel,
}