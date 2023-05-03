const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

//  플레이/일시정지 버튼
const handlePlayBtn = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

// 음량 - 음소거 버튼, 볼륨 막대
const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "음소거 해제" : "음소거";
  volume.value = video.muted ? 0 : 0.5;
};

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);
