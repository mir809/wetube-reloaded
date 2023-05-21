//이곳에서 만든 후에 사용할 경로에서 get, use 등을 해줘야 적용 가능

import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.siteName = "Newtube";

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
    fileSize: 10000000,
  },
});
