const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5; // 볼륨 초기값
video.volume = volumeValue; // 영상의 실제 소리

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

let playAgain = false;

const fullScreenBtn = document.getElementById("fullScreen");
const videoBox = document.getElementById("videoBox");

const videoControler = document.getElementById("videoControler");

let controlsTimeout = null;

//  플레이/일시정지 버튼
const clickPlayBtn = () => {
  playAgain = video.paused;

  video.paused ? video.play() : video.pause();
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
  // 음소거 해제시 볼륨막대 위치가 음소거 하기 전으로 돌아감
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
  } // 볼륨조절 막대가 마지막에 멈춰있던 값을 기억함 (0일때 제외)
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
  ); // 시작시 동영상 현재시간 = 전체시간 - 전체시간
  totalTime.innerText = formatTime(Math.floor(video.duration));

  timeline.max = Math.floor(video.duration);
};

const timelineInput = (event) => {
  const {
    target: { value }, // 타입라인 막대를 조절한 값
  } = event;

  video.currentTime = value;
  // 타임라인 막대에 따라 실제 영상시간 조절

  video.pause();
  // 타임라인 막대 조절 중에는 영상 일시정지
};

const timelineChange = (event) => {
  playAgain ? video.play() : video.pause();
};
/* 타임라인 막대 조절 후 다시재생시작 or 정지상태 유지 여부 결정
 (타임라인 막대 조절 전 동영상이 재생중인지 정지인지에 따라) */

const fullScreenClick = () => {
  const fullScreen = document.fullscreenElement;
  //현재 전체화면상태인지 파악
  if (fullScreen) {
    document.exitFullscreen(); //전체화면 해제
    fullScreenBtn.innerText = "전체화면";
  } else {
    videoBox.requestFullscreen(); // 전체화면으로 변경
    fullScreenBtn.innerText = "전체화면 종료";
  }
};

const mouseMove = () => {
  if (controlsTimeout) {
    //전역변수 'controlsTimeout'에 값이 있을경우(=null이 아닌경우)
    clearTimeout(controlsTimeout);
    // 기존 타임아웃 제거 => 클래스 유지
    controlsTimeout = null; // 변수 초기화
  }
  videoControler.classList.add("showing");
  // 마우스가 비디오 안에서 움직일때 클래스 추가

  controlsTimeout = setTimeout(() => {
    videoControler.classList.remove("showing");
  }, 3000);
  /* 마우스가 비디오 안에서 멈추거나 비디오 밖으로 나가서 더이상
 이벤트가 발생하지 않는 시점부터 3초 뒤에 클래스를 제거함, 
  setTimeout 함수의 id를 전역변수인 'controlsTimeout'에 넣어줌*/
};

const videoEnd = () => {
  // 비디오 재생이 끝난경우 (시청 후)\
  const { id } = videoBox.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "post",
  });

  playBtn.innerText = "Replay";
  // 재생버튼 -> '다시시작'으로 변경
};

playBtn.addEventListener("click", clickPlayBtn);
//동영상 일시정지, 시작
muteBtn.addEventListener("click", clickMuteBtn);
volumeRange.addEventListener("input", volumeInput);
volumeRange.addEventListener("change", volumeChange);
// input: range 드래그시 실시간 적용
// change: 드래그 후 마우스 놨을 때만 적용

video.addEventListener("timeupdate", timeUpdate);
video.addEventListener("loadedmetadata", loadedMetaData);
//비디오 '재생시간/전체시간'

timeline.addEventListener("input", timelineInput);
timeline.addEventListener("change", timelineChange);
// 비디오 타임라인 조절 막대

fullScreenBtn.addEventListener("click", fullScreenClick);
//전체화면, 전체화면 종료

video.addEventListener("mousemove", mouseMove);
// 컨트롤러 표시, 비표시

video.addEventListener("ended", videoEnd);
// 비디오 시청 후 조회수 증가
