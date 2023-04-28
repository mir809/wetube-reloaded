import express from "express";

import {
  edit,
  remove,
  logout,
  profile,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/:id(\\d+)", profile);

export default userRouter;
