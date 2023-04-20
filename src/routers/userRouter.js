import express from "express";

import { edit, remove, logout, profile } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/delete", remove);
userRouter.get("/:id(\\d+)", profile);

export default userRouter;
