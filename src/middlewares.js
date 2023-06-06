//이곳에서 만든 후에 사용할 경로에서 get, use 등을 해줘야 적용 가능

import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Newtube";

  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};

  next();
};

export const smallVideoPlayer = (req, res, next) => {
  res.locals.smallPlayer = Boolean(req.session.smallPlayer);
  res.locals.smallVideo = req.session.smallVideo || {};
  res.locals.smallVideoTime = req.session.smallVideoTime || 0;

  // 영상 재생/정지 여부
  // 그외 영상 배속, 음량 정보등 그대로 유지
  next();
};

export const Log_In_Only = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "로그인 후 이용가능합니다.");
    return res.redirect("/login");
  }
}; // '로그인' 되있는 경우에만 그대로 진행

export const Log_Out_Only = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
}; // '비로그인' 시에만 그대로 진행

export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 3000000, //파일 용량제한 - 단위: byte
  },
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 50000000, // 최대 50MB
  },
});

export const logoTextAccount = (req, res, next) => {
  res.locals.logoTextAccount = "계정";

  next();
};

export const logoTextStudio = (req, res, next) => {
  res.locals.logoTextStudio = "스튜디오";

  next();
};
