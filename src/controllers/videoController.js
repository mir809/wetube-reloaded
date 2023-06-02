import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

// home(/)
export const home = async (req, res) => {
  const videos = await Video.find({}).populate("owner");
  const randomVideos = videos.sort(() => Math.random() - 0.5);
  // videos 배열안의 내용을 랜덤으로 정렬

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
  return res.render("videos/search", {
    pageTitle: `${keyword} - NewTube`,
    videos,
    keyword,
  });
};

export const showSmallPlayer = async (req, res) => {
  const { id } = req.params;

  const smallVideo = await Video.findById(id);
  if (!smallVideo) {
    return res.sendStatus(404);
  }
  req.session.smallPlayer = true;
  req.session.smallVideo = smallVideo;

  return res.redirect("/");
};

export const nowTime = async (req, res) => {
  const {
    body: { videoTime },
  } = req;

  req.session.smallVideoTime = videoTime;

  return res.sendStatus(201);
};

export const deleteSmallPlayer = async (req, res) => {
  req.session.smallPlayer = false;

  return res.sendStatus(201);
};

//videos
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  // 해당 데이터베이스에 있는 내용을 더 자세히 보여줌

  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "Video not found.", video });
  }
  req.session.smallPlayer = false;

  const videos = await Video.find({}).populate("owner");
  const relationVideos = videos
    .filter((v) => v._id.toString() !== id)
    .sort(() => Math.random() - 0.5);

  return res.render("videos/watch", {
    pageTitle: video.title,
    video,
    relationVideos,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "Video not found.", video });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit-video", {
    pageTitle: `Edit : ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
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
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "동영상 변경사항이 저장되었습니다.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  const videoPath = video[0].path;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: videoPath,
      thumbUrl: thumb[0].path,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });

    const user = await User.findById(_id);
    user.videos.unshift(newVideo._id);
    await user.save();
    return res.redirect("/");
  } catch (error) {
    console.log("Upload Failed");
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: "동영상 업로드 실패",
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(_id);
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "Video not found.", video });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  //해당 video 삭제
  user.videos.splice(user.videos.indexOf(id), 1);
  // User DB속 videos배열에 있는 정보까지 삭제
  user.save();
  await Comment.deleteMany({ video: id });
  // Comment 컬렉션에서 해당 video 의 id를 가진 항목을 모두삭제
  return res.redirect("/");
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

  return res.status(201).json({ newCommentId: comment._id });
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

  return res.sendStatus(201);
};

export const record = async (req, res) => {
  return res.render("videos/recorder", { pageTitle: "Record" });
};
