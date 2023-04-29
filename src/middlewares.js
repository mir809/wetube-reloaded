//이곳에서 만든 후에 사용할 경로에서 get, use 등을 해줘야 적용 가능

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const Log_In_Only = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
}; // '로그인' 되있는 경우에만 그대로 진행

export const Log_Out_Only = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
}; // '로그아웃' 되있는 경우에만 ..
