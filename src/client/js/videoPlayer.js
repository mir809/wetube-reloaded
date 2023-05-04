const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

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
  const {
    target: { value }, // 볼륨 막대를 조절한 값
  } = event;
  if (Number(value) !== 0) {
    volumeValue = value;
  }
};

// 동영상 시간
const formatTime = (seconds) => {
  let N;
  if (video.duration >= 36000) {
    N = 11;
  } else if (video.duration >= 3600) {
    N = 12;
  } else if (video.duration >= 600) {
    N = 14;
  } else {
    N = 15;
  } //동영상 전체시간(video.duration)기준으로 표시되는 시간단위 조절
  return new Date(seconds * 1000).toISOString().substring(N, 19);
};

const timeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));

  timeline.value = Math.floor(video.currentTime);
};

const loadedMetaData = () => {
  currentTime.innerText = formatTime(
    Math.floor(video.duration) - Math.floor(video.duration)
  );
  totalTime.innerText = formatTime(Math.floor(video.duration));

  timeline.max = Math.floor(video.duration);
};

let again = true;

const timelineInput = (event) => {
  const {
    target: { value }, // 타입라인 막대를 조절한 값
  } = event;

  video.currentTime = value;
  // 타임라인 막대에 따라 실제 영상시간 조절

  // 만약 비디오가 재생중이였을 경우 타임라인 움직이는동안 재생멈춤
};

const timelineChange = (event) => {};

playBtn.addEventListener("click", clickPlayBtn);

muteBtn.addEventListener("click", clickMuteBtn);
volumeRange.addEventListener("input", volumeInput);
volumeRange.addEventListener("change", volumeChange);
// input: range 드래그시 실시간 적용
// change: 드래그 후 마우스 놨을 때만 적용

video.addEventListener("timeupdate", timeUpdate);
video.addEventListener("loadedmetadata", loadedMetaData);

timeline.addEventListener("input", timelineInput);
timeline.addEventListener("change", timelineChange);
