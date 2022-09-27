'use strict';

// 3rd Party Resources
const express = require('express');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const usersSchema = require('./models/Users.schema');
const usersRouter = require('./routes/users');

// NOTE: connected to sqlite::memory out of box for proof of life
// TODO: 
// connect postgres for local dev environment and prod
// handle SSL requirements
// connect with sqlite::memory for testing
// const DATABASE_URL = 'sqlite::memory'

// Prepare the express app
const app = express();
const PORT = process.env.PORT || 3002;

// Process JSON input and put the data on req.body
app.use(express.json());
// Process FORM intput and put the data on req.body
app.use(express.urlencoded({ extended: true }));

// const sequelize = new Sequelize(DATABASE_URL);

app.use(usersRouter);

// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
// app.post('/signin', async (req, res) => {

//   /*
//     req.headers.authorization is : "Basic sdkjdsljd="
//     To get username and password from this, take the following steps:
//       - Turn that string into an array by splitting on ' '
//       - Pop off the last value
//       - Decode that encoded string so it returns to user:pass
//       - Split on ':' to turn it into an array
//       - Pull username and password from that array
//   */

//   let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
//   let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
//   let decodedString = base64.decode(encodedString); // "username:password"
//   let [username, password] = decodedString.split(':'); // username, password

//   /*
//     Now that we finally have username and password, let's see if it's valid
//     1. Find the user in the database by username
//     2. Compare the plaintext password we now have against the encrypted password in the db
//        - bcrypt does this by re-encrypting the plaintext password and comparing THAT
//     3. Either we're valid or we throw an error
//   */
//   try {
//     const user = await usersSchema.findOne({ where: { username: username } });
//     const valid = await bcrypt.compare(password, user.password);
//     if (valid) {
//       res.status(200).json(user);
//     }
//     else {
//       throw new Error('Invalid User');
//     }
//   } catch (error) { res.status(403).send('Invalid Login'); }

// });

// make sure our tables are created, start up the HTTP server.
// sequelize.sync()
//   .then(() => {
//     app.listen(PORT, () => console.log('server running on port ', PORT));
//   }).catch(e => {
//     console.error('Could not start server', e.message);
//   });

function start(){
  app.listen(PORT, () => console.log('server running on port ', PORT));
}

module.exports = { app, start }
