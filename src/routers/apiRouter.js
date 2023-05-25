import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  deleteSmallPlayer,
  nowTime,
} from "../controllers/videoController";

import { changeDefaultAvatar } from "../controllers/userController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);

apiRouter
  .route("/videos/:id([0-9a-f]{24})/comment")
  .post(createComment)
  .delete(deleteComment);

apiRouter.post("/users/edit/avatar", changeDefaultAvatar);

apiRouter.post("/small/time", nowTime);
apiRouter.post("/small/clear", deleteSmallPlayer);

export default apiRouter;
