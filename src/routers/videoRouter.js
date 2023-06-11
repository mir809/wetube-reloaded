import express from "express";

import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
  record,
  videosManage,
} from "../controllers/videoController";

import {
  Log_In_Only,
  Log_Out_Only,
  videoUpload,
  logoTextStudio,
  smallVideoDataReset,
} from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", smallVideoDataReset, watch);

videoRouter
  .route("/upload")
  .all(Log_In_Only, logoTextStudio)
  .get(getUpload)
  .post(
    videoUpload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumb", maxCount: 1 },
    ]),
    postUpload
  );

videoRouter.get("/record", logoTextStudio, record);

videoRouter.get("/manage", logoTextStudio, videosManage);

videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(Log_In_Only, logoTextStudio)
  .get(getEdit)
  .post(postEdit);

videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(Log_In_Only)
  .get(deleteVideo);

export default videoRouter;
