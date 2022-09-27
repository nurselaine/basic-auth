'use strict';

const express = require('express');
const app = express();
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/index');

module.exports = async (req, res, next) => {
  let { authorization } = req.headers;
  console.log(`authorization::::::::: ${authorization}`);

  if(!authorization){
    res.stats(400).send('Not Authorized');
  } else {
    // parse basic auth string
    let authString = authorization.split(' ')[1];
    console.log(`authstr: ${authString}`);

    let decodedAuthString = base64.decode(authString);

    let [ username, password ] = decodedAuthString.split(':');
    // find user in db
    let user = await UserModel.findOne({where: {username }})

    if(user){
      let validUser = await bcrypt.compare(password, user.password);

      if(validUser){
        req.user = user; // attaching user to the request object
        next();
      } else {
        next('Not Authorized');
      }
    }

  }
}
