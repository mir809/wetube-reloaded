import express from "express";

import {
  startGithubLogin,
  finishGithubLogin,
  logout,
  channel,
  getProfileEdit,
  postProfileEdit,
  accountManage,
  getAccountEdit,
  postAccountEdit,
  getChangePassword,
  postChangePassword,
  getDeleteAccount,
  postDeleteAccount,
  channelInfo,
} from "../controllers/userController";

import {
  Log_In_Only,
  Log_Out_Only,
  avatarUpload,
  logoTextAccount,
} from "../middlewares";
const userRouter = express.Router();

userRouter.get("/github/start", Log_Out_Only, startGithubLogin);
userRouter.get("/github/finish", Log_Out_Only, finishGithubLogin);

userRouter.get("/logout", Log_In_Only, logout);

userRouter.get("/:id([0-9a-f]{24})", channel);
userRouter.get("/:id([0-9a-f]{24})/info", channelInfo);

userRouter
  .route("/edit")
  .all(Log_In_Only, logoTextAccount)
  .get(getProfileEdit)
  .post(avatarUpload.single("avatar"), postProfileEdit);

userRouter.get("/account/manage", Log_In_Only, logoTextAccount, accountManage);

userRouter
  .route("/account/edit")
  .all(Log_In_Only, logoTextAccount)
  .get(getAccountEdit)
  .post(postAccountEdit);

userRouter
  .route("/account/change-password")
  .all(Log_In_Only, logoTextAccount)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter
  .route("/account/delete")
  .all(Log_In_Only, logoTextAccount)
  .get(getDeleteAccount)
  .post(postDeleteAccount);

export default userRouter;
