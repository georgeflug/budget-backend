import {checkAccounts} from "./check-accounts-service";
import {Route} from "../route";
import express from "express";

const router = express.Router();

router.route('/')
    .get(async function (req, res) {
      res.send(await checkAccounts());
    });

export const checkAccountConnectivityRoute: Route = {
  router,
  basePath: '/check-account-connectivity'
}