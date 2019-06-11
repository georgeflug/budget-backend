// temporary code to have typescript recognize this file as a module
export { };

import basicAuth from 'express-basic-auth'
// const basicAuth = require('express-basic-auth')

const username: any = process.env.SECRET_USERNAME

module.exports = basicAuth({
  users: { [username]: process.env.SECRET_PASSWORD },
  unauthorizedResponse: function getUnauthorizedResponse() {
    return {
      message: "Unauthorized"
    }
  }
});
