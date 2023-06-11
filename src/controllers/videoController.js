import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

const selectStudioMain = "select";
const selectUpload = "select";
const selectRecord = "select";
const selectVideosManage = "select";

const watchedVideoDataDelete = (req, res) => {
  req.session.smallVideoTime = null;
  req.session.smallVideoPaused = null;
  req.session.smallVideoVolume = null;
  req.session.smallVideoMuted = null;
  req.session.smallVideoDummyMute = null;
  req.session.smallVideo = null;
  req.session.smallVideoId = null;

  res.locals.smallVideo = req.session.smallVideo || {};
  res.locals.smallVideoTime = req.session.smallVideoTime || null;
  res.locals.smallVideoPaused = req.session.smallVideoPaused || true;
  res.locals.smallVideoMuted = req.session.smallVideoMuted || false;
  res.locals.smallVideoDummyMute = req.session.smallVideoDummyMute || false;
  res.locals.smallVideoVolume = req.session.smallVideoVolume || null;
  res.locals.smallVideoId = req.session.smallVideoId || null;
};

// home(/)
export const home = async (req, res) => {
  const videos = await Video.find({}).populate("owner");
  const randomVideos = videos.sort(() => Math.random() - 0.5);
  // videos 배열안의 내용을 랜덤으로 정렬

  req.session.beforeDelete = req.url;
  req.session.beforeSmallPlayer = req.url;
  // 돌아갈 주소 저장

  return res.render("videos/home", { pageTitle: "NewTube", randomVideos });
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }

  req.session.beforeSmallPlayer = req.url;
  // 돌아갈 주소 저장

  return res.render("videos/search", {
    pageTitle: `${keyword} - NewTube`,
    videos,
    keyword,
  });
};

export const showSmallPlayer = async (req, res) => {
  // 소형 플레이어 생성
  const {
    body: { videoTime, videoPaused, volumeValue, videoMuted, DummyMute },
    params: { id },
  } = req;

  const smallVideo = await Video.findById(id).populate("owner");
  if (!smallVideo) {
    return res.sendStatus(404);
  }
  req.session.smallVideoTime = videoTime;
  req.session.smallVideoPaused = videoPaused;
  req.session.smallVideoVolume = volumeValue;
  req.session.smallVideoMuted = videoMuted;
  req.session.smallVideoDummyMute = DummyMute;

  req.session.smallPlayer = true;
  req.session.smallVideo = smallVideo;
  req.session.smallVideoId = id;

  const lastPage = req.session.beforeSmallPlayer;

  return res.status(201).json({ lastPage });
};

export const returnWatchPage = async (req, res) => {
  // 영상 시청 화면 복귀

  const {
    body: { videoTime, videoPaused, volumeValue, videoMuted, DummyMute },
    params: { id },
  } = req;

  const smallVideo = await Video.findById(id).populate("owner");
  if (!smallVideo) {
    req.flash("error", "해당 영상이 존재하지 않습니다.");

    return res.sendStatus(404);
  }
  req.session.smallVideoTime = videoTime;
  req.session.smallVideoPaused = videoPaused;
  req.session.smallVideoVolume = volumeValue;
  req.session.smallVideoMuted = videoMuted;
  req.session.smallVideoDummyMute = DummyMute;

  req.session.smallPlayer = false;

  return res.status(201).json({});
};

export const deleteSmallPlayer = async (req, res) => {
  req.session.smallPlayer = false;

  watchedVideoDataDelete(req, res);

  return res.sendStatus(201);
};

export const studioMain = async (req, res) => {
  return res.render("videos/studio/studio-main", {
    pageTitle: "NewTube 스튜디오",
    selectStudioMain,
  });
};

//videos
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
      },
    });
  // 해당 데이터베이스에 있는 내용을 더 자세히 보여줌

  req.session.smallPlayer = false;
  // 영상 시청 페이지로 갈경우 기존 소형플레이어 표시 여부 X로

  if (req.session.smallVideoId !== id) {
    watchedVideoDataDelete(req, res);
  }

  if (!video) {
    req.flash("error", "존재하지 않는 동영상입니다.");

    const noneVideo = true;
    return res
      .status(404)
      .render("404", { pageTitle: "Video not found.", noneVideo });
  }

  const videos = await Video.find({}).populate("owner");
  const relationVideos = videos
    .filter((v) => v._id.toString() !== id)
    .sort(() => Math.random() - 0.5);

  req.session.beforeUpdate = "/videos" + req.url;

  return res.render("videos/watch", {
    pageTitle: video.title,
    video,
    relationVideos,
  });
};

export const getUpload = (req, res) => {
  return res.render("videos/studio/upload", {
    pageTitle: "동영상 업로드",
    selectUpload,
  });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  const videoPath = video[0].path;

  const trimmedDescription = description.replace(/^\n+|\n+$/g, "");
  // 영상설명에서 양끝 줄바꿈 제거

  try {
    const newVideo = await Video.create({
      title,
      description: trimmedDescription,
      fileUrl: videoPath,
      thumbUrl: thumb[0].path,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });

    const user = await User.findById(_id);
    user.videos.unshift(newVideo._id);
    await user.save();

    req.flash("success", "동영상이 생성되었습니다.");

    return res.redirect("/");
  } catch (error) {
    console.log("Upload Failed");
    req.flash("error", "동영상 생성에 실패했습니다.");

    return res.status(400).render("videos/studio/upload", {
      pageTitle: "동영상 업로드",
      errorMessage: "동영상 업로드 실패",
    });
  }
};

export const record = async (req, res) => {
  return res.render("videos/studio/recorder", {
    pageTitle: "동영상 촬영",
    selectRecord,
  });
};

export const videosManage = async (req, res) => {
  const {
    user: { _id },
  } = req.session;

  const videos = await Video.find({ owner: _id }).sort({ createdAt: -1 });

  const formattedVideos = videos.map((video) => {
    const uploadDate = new Date(video.createdAt);
    const year = uploadDate.getFullYear().toString().padStart(4, "0");
    const month = (uploadDate.getMonth() + 1).toString().padStart(2, "0");
    const day = uploadDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}. ${month}. ${day}`;

    return { ...video._doc, formattedDate };
  });

  req.session.beforeDelete = "/videos" + req.url;
  req.session.beforeUpdate = "/videos" + req.url;
  req.session.beforeSmallPlayer = "/videos" + req.url;

  // 돌아갈 주소 저장

  return res.render("videos/studio/videos-manage", {
    pageTitle: "동영상 관리",
    videos: formattedVideos,
    selectVideosManage,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  let video = await Video.findById(id);

  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "Video not found.", video });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash(
      "error",
      "동영상을 변경할 수 없습니다. (동영상 수정은 게시자만 가능합니다.)"
    );
    return res.status(403).redirect("/");
  }

  video = [video].map((video) => {
    const uploadDate = new Date(video.createdAt);
    const year = uploadDate.getFullYear().toString().padStart(4, "0");
    const month = (uploadDate.getMonth() + 1).toString().padStart(2, "0");
    const day = uploadDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}년 ${month}월 ${day}일`;

    return { ...video._doc, formattedDate };
  });

  return res.render("videos/studio/edit-video", {
    pageTitle: "동영상 수정",
    video: video[0],
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;

  const video = await Video.findById(id);

  const trimmedDescription = description
    ? description.replace(/^\n+|\n+$/g, "")
    : "";

  if (!video) {
    req.flash("error", "존재하지 않는 동영상입니다.");

    return res
      .status(404)
      .render("404", { pageTitle: "Video not found.", video });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash(
      "error",
      "동영상을 변경할 수 없습니다. (동영상 수정은 게시자만 가능합니다.)"
    );
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description: trimmedDescription,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("info", "동영상 변경사항이 저장되었습니다.");

  return res.redirect(req.session.beforeUpdate);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video) {
    req.flash("error", "존재하지 않는 동영상입니다.");

    return res
      .status(404)
      .render("404", { pageTitle: "Video not found.", video });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash(
      "error",
      "동영상을 삭제할 수 없습니다. (동영상 삭제는 게시자만 가능합니다.)"
    );
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  //해당 video 삭제
  user.videos.splice(user.videos.indexOf(id), 1);
  // User DB속 videos배열에 있는 정보까지 삭제
  user.save();
  await Comment.deleteMany({ video: id });
  // Comment 컬렉션에서 해당 video 의 id를 가진 항목을 모두삭제

  req.flash("success", "동영상이 삭제되었습니다.");

  return res.redirect(req.session.beforeDelete);
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();

  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  //Video 모델(DB)에서 id가 일치하는 비디오를 찾음

  if (!video) {
    return res.sendStatus(404);
  } // 없을경우 404호출 후 request 종료

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();

  return res.status(201).json({ newCommentId: comment._id, user });
};

export const deleteComment = async (req, res) => {
  const {
    body: { deleteId },
    params: { id },
  } = req;

  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  } // 없을경우 404호출 후 request 종료

  await Comment.findByIdAndDelete(deleteId);
  video.comments.splice(video.comments.indexOf(id), 1);
  // User DB속 videos배열에 있는 정보까지 삭제
  video.save();

  //req.flash("success", "댓글이 삭제되었습니다.");
  // ! 문제 : 댓글 삭제한 순간 새로고침 되는게 아니라
  // 여러개 삭제후 새로고침 했을때, 글씨가 여러번뜸

  return res.sendStatus(201);
};
