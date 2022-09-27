'use strict';

const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/index');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const basicAuth = require('../middleware/basicAuth');

// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup username=john password=foo
router.post('/signup', async (req, res) => {
  try{
    const { username, password } = req.body;   
    const encryptedPassword = await bcrypt.hash(req.body.password, 5);
    console.log(`username ${username} password ${encryptedPassword}`);
    const user = await UserModel.create({
      username, 
      password: encryptedPassword,
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send('sign up error occured');
  }
});

router.get('/hello', basicAuth, (req, res, next) => {
  let { name } = req.query;
  res.status(200).send(`Welcome ${name}! This route is now secured with Basic Auth!`);
})

router.post('/signin', basicAuth, async (req, res) => {

  /*
    req.headers.authorization is : "Basic sdkjdsljd="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */

  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
  console.log(`req.headers.authorization ${req.headers.authorization}`);
  let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password
  console.log(`username ${username} password ${password}`);
  /*
    Now that we finally have username and password, let's see if it's valid
    1. Find the user in the database by username
    2. Compare the plaintext password we now have against the encrypted password in the db
       - bcrypt does this by re-encrypting the plaintext password and comparing THAT
    3. Either we're valid or we throw an error
  */
  try {
    const user = await UserModel.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      res.status(200).json(user);
    }
    else {
      throw new Error('Invalid User');
    }
  } catch (error) { res.status(403).send('Invalid Login'); }

});

module.exports = router;