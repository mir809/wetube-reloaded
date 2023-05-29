import express from "express";

import {
  getEdit,
  postEdit,
  logout,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
  getDeleteAccount,
  postDeleteAccount,
  account,
  channel,
} from "../controllers/userController";

import { Log_In_Only, Log_Out_Only, avatarUpload } from "../middlewares";
const userRouter = express.Router();

userRouter.get("/github/start", Log_Out_Only, startGithubLogin);
userRouter.get("/github/finish", Log_Out_Only, finishGithubLogin);

userRouter.get("/logout", Log_In_Only, logout);

userRouter.get("/:id([0-9a-f]{24})", channel);

userRouter
  .route("/edit")
  .all(Log_In_Only)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);

userRouter
  .route("/edit/change-password")
  .all(Log_In_Only)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter
  .route("/account/delete")
  .all(Log_In_Only)
  .get(getDeleteAccount)
  .post(postDeleteAccount);

userRouter.get("/account", account);

export default userRouter;
