//이곳에서 만든 후에 사용할 경로에서 get, use 등을 해줘야 적용 가능

import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Newtube";

  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};

  res.locals.Theme = req.session.Theme || "white";

  next();
};

export const smallVideoPlayer = (req, res, next) => {
  res.locals.smallPlayer = Boolean(req.session.smallPlayer);
  // 소형 플레이어 생성할지 여부
  res.locals.smallVideo = req.session.smallVideo || {};
  // 해당 비디오 정보
  res.locals.smallVideoTime = req.session.smallVideoTime;
  //해당 비디오 현재 시간
  res.locals.smallVideoPaused = req.session.smallVideoPaused;
  // 해당 영상 재생/정지 여부
  res.locals.smallVideoMuted = req.session.smallVideoMuted;
  res.locals.smallVideoDummyMute = req.session.smallVideoDummyMute;
  // 해당 영상 음소거 + 방향키에 의한 음소거인지 여부
  res.locals.smallVideoVolume = req.session.smallVideoVolume;
  // 해당 영상 음량 기억
  res.locals.smallVideoId = req.session.smallVideoId;
  // 해당 영상 id

  // 그외 영상 배속, 음량 정보등 그대로 유지
  next();
};

export const smallVideoDataReset = (req, res, next) => {
  // watch페이지 갔을 때 기존 소형플레이어 데이터와 비디오 id다를경우
  // 소형플레이어 관련 데이터 삭제

  const { id } = req.params;

  /*
  if (req.session.smallVideoId !== id && req.session.smallVideoId) {
    // 기존 소형플레이어의 id와 다를경우 기존에 저장한 데이터 제거

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
  }
  */
  next();
};

export const nowUrl = (req, res, next) => {
  const { url } = req;
  const regex = /^\/users\/([0-9a-f]{24})(\/info)?$/;

  if (regex.test(url)) {
    // 채널 관련 페이지 인 경우
    //console.log("Yes 채널 페이지가 감지되었습니다.");
    // 여기에 특정 동작을 수행하는 코드를 작성하세요.
  } else {
    //console.log("No 채널 페이지가 아닙니다.");

    if (url === "/" || req.url.startsWith("/search")) {
      // 홈 또는 검색 페이지인 경우
      //console.log("현재 페이지 : 홈 or 검색");
    } else {
      //console.log("소형 플레이어 데이터 삭제");
      req.session.smallPlayer = false;
      // 소형 플레이어 생성할지 여부
    }
  }

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

export const lastPage = (req, res, next) => {
  res.locals.beforeDelete = req.session.beforeDelete;
  // 동영상 삭제전 마지막 페이지
  res.locals.beforeUpdate = req.session.beforeUpdate;
  // 동영상 업데이트 전 마지막 페이지
  res.locals.beforeSmallPlayer = req.session.beforeSmallPlayer;
  // 소형 플레이어 실행 (영상 시청화면)전 마지막 페이지

  next();
};
