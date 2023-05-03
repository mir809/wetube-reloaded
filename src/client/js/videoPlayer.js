const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5;

video.volume = volumeValue; // 영상의 실제 소리

//  플레이/일시정지 버튼
const clickPlayBtn = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

// 음량 - 음소거 버튼, 볼륨 막대
const clickMuteBtn = () => {
  if (video.muted) {
    video.muted = false;
    video.volume = volumeValue;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "음소거 해제" : "음소거";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const volumeInput = (event) => {
  // 볼륨조절 드래그시 실시간 적용
  const {
    target: { value }, // 볼륨 막대를 조절한 값
  } = event;
  if (Number(value) === 0) {
    muteBtn.innerText = "음소거 해제";
    video.muted = true;
  } else {
    video.muted = false;
    muteBtn.innerText = "음소거";
  }
  video.volume = value; // 영상의 실제 소리
};

const volumeChange = (event) => {
  // 볼륨조절 드래그 후 마우스를 놨을 때만 적용
  const {
    target: { value }, // 볼륨 막대를 조절한 값
  } = event;
  if (Number(value) !== 0) {
    volumeValue = value;
  }
};

playBtn.addEventListener("click", clickPlayBtn);
muteBtn.addEventListener("click", clickMuteBtn);
volumeRange.addEventListener("input", volumeInput);
volumeRange.addEventListener("change", volumeChange);
