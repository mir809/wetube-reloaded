import express from "express";

import {
  getEdit,
  postEdit,
  logout,
  profile,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";

import { Log_In_Only, Log_Out_Only, uploadFiles } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", Log_Out_Only, startGithubLogin);
userRouter.get("/github/finish", Log_Out_Only, finishGithubLogin);

userRouter.get("/logout", Log_In_Only, logout);
userRouter
  .route("/edit")
  .all(Log_In_Only)
  .get(getEdit)
  .post(uploadFiles.single("avatar"), postEdit);

userRouter.get("/:id(\\d+)", profile);

userRouter
  .route("/change-password")
  .all(Log_In_Only)
  .get(getChangePassword)
  .post(postChangePassword);

export default userRouter;
