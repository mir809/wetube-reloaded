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
  video.addEventListener("loadedmetadata", loadedMetaData);
});

const smallPlayer = document.querySelector(".small_player");
const smallVideo = document.querySelector(".small_player video");
const smallPlayeClearBtn = document.getElementById("smallPlayeClear");

if (smallPlayer) {
  //소형 플레이어가 존재 할 경우에만 작동
  const smallPlayeClear = async (event) => {
    const response = await fetch(`/api/small/clear`, {
      method: "post",
    });
    if (response.status === 201) {
      const delsmall = event.target.parentElement;
      delsmall.remove();
    }
  };

  smallPlayeClearBtn.addEventListener("click", smallPlayeClear);

  const time = smallPlayer.dataset.id;

  smallVideo.currentTime = time;
}

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
