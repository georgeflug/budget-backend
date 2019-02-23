const basicAuth = require('express-basic-auth')

module.exports = basicAuth({
  users: { [process.env.SECRET_USERNAME]: process.env.SECRET_PASSWORD },
  unauthorizedResponse: function getUnauthorizedResponse() {
    return {
      message: "Unauthorized"
    }
  }
});
