const videoTimeList = document.querySelectorAll(".videoTime");
const videoList = document.querySelectorAll(".video-mixin__video");

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
  videoList.forEach((video, index) => {
    const duration = Math.floor(video.duration);
    if (!isNaN(duration)) {
      videoTimeList[index].innerText = formatTime(duration);
    }
  });
};

videoList.forEach((video) => {
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
