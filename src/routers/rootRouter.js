import express from "express";

import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";

import { home, search, studioMain } from "../controllers/videoController";

import { Log_In_Only, Log_Out_Only, logoTextStudio } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(Log_Out_Only).get(getJoin).post(postJoin);
rootRouter.route("/login").all(Log_Out_Only).get(getLogin).post(postLogin);
rootRouter.get("/search", search);

rootRouter.get("/studio/main", logoTextStudio, studioMain);

export default rootRouter;
