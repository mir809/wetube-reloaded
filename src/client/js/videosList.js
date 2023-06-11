const mixinVideoTime = document.querySelectorAll(".videoTime");
const mixinVideo = document.querySelectorAll(".video-mixin__video");

// 동영상 시간
const formatTime = (seconds) => {
  let N;
  if (seconds >= 36000) {
    N = 11;
  } else if (seconds >= 3600) {
    N = 12;
  } else if (seconds >= 600) {
    N = 14;
  } else {
    N = 15;
  } //동영상 전체시간(seconds)기준으로 표시되는 시간단위 조절
  return new Date(seconds * 1000).toISOString().substring(N, 19);
};

const loadedMetaData = () => {
  mixinVideo.forEach((video, index) => {
    const duration = Math.floor(video.duration);
    if (!isNaN(duration)) {
      mixinVideoTime[index].innerText = formatTime(duration);
    }
  });
};

mixinVideo.forEach((video) => {
  if (video.readyState >= 2) {
    loadedMetaData();
  } else {
    video.addEventListener("loadedmetadata", loadedMetaData);
  }
});

const homeVideoMixin = document.querySelectorAll(".home-video-mixin");
const userVideoMixin = document.querySelectorAll(".user-video-mixin");

if (homeVideoMixin.length > 0) {
  if (homeVideoMixin.length < 3) {
    const requiredCount = 3 - homeVideoMixin.length;

    for (let i = 0; i < requiredCount; i++) {
      const virtualMixin = document.createElement("div");
      virtualMixin.classList.add("home-video-mixin");
      // 가상 요소의 스타일을 설정할 수 있으면 설정하세요.
      // virtualMixin.style.width = '350px';
      // virtualMixin.style.height = '200px';

      // 가상 요소를 .home_videos 요소에 추가합니다.
      document.querySelector(".home_videos").appendChild(virtualMixin);
    }
  }
}

if (userVideoMixin.length > 0) {
  if (userVideoMixin.length < 5) {
    const requiredCount = 5 - userVideoMixin.length;

    for (let i = 0; i < requiredCount; i++) {
      const virtualMixin = document.createElement("div");
      virtualMixin.classList.add("user-video-mixin");
      // 가상 요소의 스타일을 설정할 수 있으면 설정하세요.
      // virtualMixin.style.width = '350px';
      // virtualMixin.style.height = '200px';

      // 가상 요소를 .user_videos 요소에 추가합니다.
      document.querySelector(".user_videos").appendChild(virtualMixin);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const mixins = document.querySelectorAll(
    ".home-video-mixin, .search-video-mixin"
  );

  mixins.forEach((mixin) => {
    const ownerAvatar = mixin.querySelector(".video_owner_avatar");
    const ownerName = mixin.querySelector(".video_owner_name");
    const ownerLink = mixin.querySelector(".video-mixin_video_onwer_link");

    if (ownerAvatar) {
      ownerAvatar.addEventListener("click", (event) => {
        event.preventDefault();
        ownerLink.click();
      });
    }

    if (ownerName) {
      ownerName.addEventListener("click", (event) => {
        event.preventDefault();
        ownerLink.click();
      });
    }
  });
});
