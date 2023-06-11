import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  deleteSmallPlayer,
  showSmallPlayer,
  returnWatchPage,
} from "../controllers/videoController";

import {
  changeDefaultAvatar,
  themeChange,
} from "../controllers/userController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);

apiRouter
  .route("/videos/:id([0-9a-f]{24})/comment")
  .post(createComment)
  .delete(deleteComment);

apiRouter.post("/users/edit/avatar", changeDefaultAvatar);

apiRouter.post("/small-player/:id([0-9a-f]{24})", showSmallPlayer);
apiRouter.post("/small/clear", deleteSmallPlayer);
// 소형 플레이어 생성, 제거
apiRouter.post("/return-watch/:id([0-9a-f]{24})", returnWatchPage);
// 영상 시청 화면으로 복귀

apiRouter.post("/theme/:id", themeChange);

export default apiRouter;
