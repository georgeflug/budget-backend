// temporary code to have typescript recognize this file as a module
import { config } from "../util/config";

export {};

import basicAuth from 'express-basic-auth'

module.exports = basicAuth({
  users: {[config.secretUsername]: config.secretPassword},
  unauthorizedResponse: function getUnauthorizedResponse() {
    return {
      message: "Unauthorized"
    }
  }
});
