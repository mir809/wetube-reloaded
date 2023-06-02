const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const playBtnText = playBtn.querySelector(".text_box");

const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const muteBtnText = muteBtn.querySelector(".text_box");

const volumeRange = document.getElementById("volume");

let volumeValue = 0.5; // 볼륨 초기값
video.volume = volumeValue; // 영상의 실제 소리
let DummyMute = false;

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

let playAgain = false;

const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const fullScreenText = fullScreenBtn.querySelector(".text_box");

const videoBox = document.getElementById("videoBox");

const videoControler = document.getElementById("videoControler");

let controlsTimeout = null; // 컨트롤러
let backAndForwardTimeout = null; // 시간 앞,뒤로가기 표시
let centerDisplayTimeout; //음소거,해제 or 재생,정지

const redColor = getComputedStyle(document.documentElement).getPropertyValue(
  "--red-color"
);
const beforeColor = `rgba(255, 255, 255, 0.3)`;
// 타임라인 막대에 넣어줄 색깔

// 모든 div.display_change_circle 요소를 선택하여 NodeList로 반환
const ChangeCircles = document.querySelectorAll(".display_change_circle");

// 개별적으로 선택된 요소에 접근하여 조작
const leftCircle = ChangeCircles[0];
const playCircle = ChangeCircles[1];
const playCircleIcon = playCircle.querySelector("i");
const rightCircle = ChangeCircles[2];
const muteCircle = ChangeCircles[3];
const nowVolume = document.querySelector(".now_volume");

// 영상 재생/일시정지
const clickPlayBtn = () => {
  centerdisplay(playCircle);

  playAgain = video.paused;
  video.paused ? video.play() : video.pause();
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
  playCircleIcon.classList = video.paused ? "fas fa-pause" : "fas fa-play";

  playBtnText.innerText = video.paused ? "재생(Space)" : "일시중지(Space)";

  showingClassAddOrRemove();
}; //버튼 클릭시

// 음량 - 음소거 버튼, 볼륨 막대
const clickMuteBtn = (event) => {
  event.stopPropagation();

  if (video.muted) {
    video.muted = false;
    DummyMute = false;
    video.volume = volumeValue;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  muteBtnText.innerText = video.muted ? "음소거 해제(m)" : "음소거(m)";
  volumeRange.value = video.muted ? 0 : volumeValue;
  // 음소거 해제시 볼륨막대 위치가 음소거 하기 전으로 돌아감
  volumeVarColor();
  centerdisplay(muteCircle);
  showNowVolume();
};

const volumeInput = (event) => {
  event.stopPropagation();

  const {
    target: { value }, // 볼륨 막대를 조절한 값
  } = event;
  if (Number(value) === 0) {
    muteBtnIcon.classList = "fas fa-volume-mute";
    muteBtnText.innerText = "음소거 해제(m)";

    video.muted = true;
  } else {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
    muteBtnText.innerText = "음소거(m)";
  }
  video.volume = value; // 영상의 실제 소리
  showNowVolume();
  //video.removeEventListener("click", clickPlayBtn);
  //videoControler.removeEventListener("click", clickPlayBtn);
};

const volumeChange = (event) => {
  event.stopPropagation();

  const {
    target: { value }, // 볼륨 막대를 조절한 값
  } = event;
  if (Number(value) !== 0) {
    volumeValue = value;
  } // 볼륨조절 막대가 마지막에 멈춰있던 값을 기억함 (0일때 제외)
};

volumeRange.addEventListener("click", function (event) {
  event.stopPropagation();
});

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

const timeUpdate = async () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));

  totalTime.innerText = formatTime(Math.floor(video.duration));
  // 영상 전체시간

  timeline.value = Math.floor(video.currentTime);
  timeline.max = await Math.floor(video.duration);

  timelineColor();
};

const loadedMetaData = async () => {
  currentTime.innerText = formatTime(
    Math.floor(video.duration) - Math.floor(video.duration)
  ); // 시작시 동영상 현재시간 = 전체시간 - 전체시간
  totalTime.innerText = formatTime(Math.floor(video.duration));
  // 영상 전체시간

  timeline.max = await Math.floor(video.duration);

  volumeVarColor();
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

const fullScreenClick = (event) => {
  event.stopPropagation();
  const fullScreen = document.fullscreenElement;
  //현재 전체화면상태인지 파악
  if (fullScreen) {
    document.exitFullscreen(); //전체화면 해제
    fullScreenIcon.classList = "fas fa-expand";
    fullScreenText.innerText = "전체화면(f)";
  } else {
    videoBox.requestFullscreen(); // 전체화면으로 변경
    fullScreenIcon.classList = "fas fa-compress";
    fullScreenText.innerText = "전체화면 종료(f)";
  }
};

const mouseMove = () => {
  showingClassAddOrRemove();
};

videoBox.addEventListener("mouseup", mouseMove);
videoBox.addEventListener("mousemove", mouseMove);

/* 마우스가 비디오 안에서 멈추거나 비디오 밖으로 나가서 더이상
 이벤트가 발생하지 않는 시점부터 3초 뒤에 클래스를 제거함, 
  setTimeout 함수의 id를 전역변수인 'controlsTimeout'에 넣어줌*/

const videoEnd = () => {
  // 비디오 재생이 끝난경우 (시청 후)\
  const { id } = videoBox.dataset;
  // 해당 영상의 id 추출
  fetch(`/api/videos/${id}/view`, {
    method: "post",
  }); // 동영상 조회수 증가

  playBtnIcon.classList = "fas fa-redo-alt";
  playBtnText.innerText = "다시 보기";

  // 동영상재생버튼 -> '다시시작'으로 변경
};

playBtn.addEventListener("click", clickPlayBtn);
playBtnIcon.addEventListener("click", clickPlayBtn);
video.addEventListener("click", clickPlayBtn);
videoControler.addEventListener("click", clickPlayBtn);
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
video.addEventListener("dblclick", fullScreenClick);
videoControler.addEventListener("dblclick", fullScreenClick);
//전체화면, 전체화면 종료

video.addEventListener("ended", videoEnd);
// 비디오 시청 후 조회수 증가

const maxVolume = () => {
  if (volumeValue > 1) {
    volumeValue = 1;
  }
};

const VideoKeyDown = (event) => {
  // 비디오박스  클릭시에만 작동

  if (event.code === "ArrowUp") {
    // 위쪽 방향키 : 음량 + 10%
    event.preventDefault();
    if (volumeValue < 1) {
      if (video.muted === true && DummyMute === false) {
        // 음소거 버튼에 의한 음소거 상태인 경우
        // : 음소거 상태 유지 + 값 저장만
        volumeValue += 0.05;
        maxVolume();
      } else if (video.muted === true && DummyMute === true) {
        // 음소거 버튼 클릭이 아닌 방향키로 인한 음소거 상태인경우
        // 바로 음소거 해제 + 값 0.1로 고정
        video.muted = false;
        DummyMute = false;
        muteBtnIcon.classList = "fas fa-volume-up";
        muteBtnText.innerText = "음소거(m)";

        volumeValue = 0.05;
        video.volume = volumeValue; //실제 볼륨
        volumeRange.value = volumeValue; //볼륨 막대
      } else if (video.muted === false) {
        // 음소거 상태가 아닌경우 : 실시간 반영
        volumeValue += 0.05;
        maxVolume();
        video.volume = volumeValue; //실제 볼륨
        volumeRange.value = volumeValue; //볼륨 막대
      }
    }
    volumeVarColor();
    centerdisplay(muteCircle);
    showNowVolume();
  }
  if (event.code === "ArrowDown") {
    // 아래쪽 방향키 : 음량 - 10%
    event.preventDefault();
    const lastVolume = volumeValue;
    if (volumeValue > 0) {
      // 볼륨이 0보다 크면 줄임
      volumeValue -= 0.05;
      if (volumeValue < 0.01) {
        volumeValue = 0;
        // 만약 줄이게되서 0이하가 되면 0으로 고정
      }
      //음소거 상태인 경우 값만 기억
      if (video.muted === false) {
        //현재 음소거 상태가 아닐 때만 실시간 반영
        video.volume = volumeValue; //실제 볼륨
        volumeRange.value = volumeValue; //볼륨 막대
        if (volumeValue === 0) {
          DummyMute = true;
          video.muted = true;
          // 음소거 아닌 상태에서 볼륨값 0이 되면
          //실제로 음소거 시킴 + 방향키에 의한 음소거라는 표시
        }
      }
      if (volumeValue === 0) {
        muteBtnIcon.classList = "fas fa-volume-mute";
        muteBtnText.innerText = "음소거 해제(m)";

        volumeValue = lastVolume;
      }
    }
    volumeVarColor();
    centerdisplay(muteCircle);
    showNowVolume();
  }
};

const WindowKeyDown = (event) => {
  // 댓글창 제외 아무곳이나 클릭시 활성화되는 단축키
  if (event.code === "Space") {
    event.preventDefault();
    //스페이스바 입력시 스크롤 내림현상 방지(기본기능 해제)
    clickPlayBtn();
  } //스페이스바 : 일시정지/시작

  if (event.code === "KeyM") {
    clickMuteBtn();
  } // M : 음소거/음소거 해제

  if (event.code === "KeyF") {
    fullScreenClick();
  } // F : 동영상 전체화면/전체화면 해제
  if (event.code === "Escape") {
    const fullScreen = document.fullscreenElement;
    //현재 전체화면상태인지 파악
    if (fullScreen) {
      document.exitFullscreen(); //전체화면 해제
      fullScreenBtn.innerText = "전체화면";
    }
  } // Esc :전체화면 상태인 경우 전체화면 해제

  if (event.code === "ArrowLeft") {
    event.preventDefault();
    video.currentTime -= 5; //실제 영상 시간
    timeline.value -= 5; // 타임라인 막대
    backAndForward(leftCircle);
  } else if (event.code === "ArrowRight") {
    event.preventDefault();
    video.currentTime += 5; //실제 영상 시간
    timeline.value += 5; // 타임라인 막대
    backAndForward(rightCircle);
  } // 방향키 좌/우 : 영상시간 +- 5초

  if (event.code.includes("Numpad") || event.code.includes("Digit")) {
    const digit = Number(event.code.slice(-1)); // event.code에서 마지막 문자열(숫자)을 추출
    if (digit >= 0 && digit <= 9) {
      const percentage = digit * 0.1;
      video.currentTime = video.duration * percentage;
      timeline.value = video.duration * percentage;
    }
  } // 숫자키 0~9까지 : 전체 영상길이 중 해당 비율만큼 이동
};

let ThisVideoBox = false;

const vidoeBoxClick = (event) => {
  //비디오 박스 클릭시에만 활성화되는 키보드 단축키
  ThisVideoBox = true;
};

const windowClick = (event) => {
  //화면 클릭시
  if (event.target.id === "textInput") {
    // 댓글 입력창 (or 검색창) 클릭시 단축키 비활성화
    window.removeEventListener("keydown", VideoKeyDown);
    window.removeEventListener("keydown", WindowKeyDown);
  } else {
    // 다른 아무 화면 클릭시 작동하는 단축키
    if (ThisVideoBox === true) {
      window.addEventListener("keydown", VideoKeyDown);
    } else {
      window.removeEventListener("keydown", VideoKeyDown);
    }
    window.addEventListener("keydown", WindowKeyDown);
    ThisVideoBox = false;
  }
  //비디오 박스 클릭시
};

videoBox.addEventListener("click", vidoeBoxClick);
//비디오 박스 클릭시
window.addEventListener("click", windowClick);
//화면 클릭시

window.addEventListener("keydown", VideoKeyDown);
window.addEventListener("keydown", WindowKeyDown);
// 최초상태 : 키보드 단축키 활성화

const smallPlayerBtn = document.getElementById("smallPlayer");

const smallPlayer = async () => {
  videoTime = video.currentTime;

  await fetch(`/api/small/time`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ videoTime }),
  });
};
smallPlayerBtn.addEventListener("click", smallPlayer);

const timelineColor = () => {
  const value = timeline.value;
  const max = timeline.max;
  const percent = (value / max) * 100;

  timeline.style.background = `linear-gradient(to right, ${redColor} ${percent}%, ${beforeColor} ${percent}%)`;
};
timeline.addEventListener("input", timelineColor);

const volumeVarColor = () => {
  const value = volumeRange.value;
  const max = volumeRange.max;
  const percent = (value / max) * 100;

  volumeRange.style.background = `linear-gradient(to right, white ${percent}%, ${beforeColor} ${percent}%)`;
};

volumeRange.addEventListener("input", volumeVarColor);

const showingClassAddOrRemove = () => {
  if (controlsTimeout) {
    //전역변수 'controlsTimeout'에 값이 있을경우(=null이 아닌경우)
    clearTimeout(controlsTimeout);
    // 기존 타임아웃 제거 => 클래스 유지
    controlsTimeout = null; // 변수 초기화
  }

  videoControler.classList.add("showing");
  // 마우스가 비디오 안에서 움직일때 클래스 추가

  if (!video.paused) {
    controlsTimeout = setTimeout(() => {
      videoControler.classList.remove("showing");
    }, 3000);
  }
};

const backAndForward = (circle) => {
  if (backAndForwardTimeout) {
    clearTimeout(backAndForwardTimeout);
    backAndForwardTimeout = null;
  }

  ChangeCircles.forEach((circle) => {
    circle.classList.remove("goTo_backAndforward");
  });
  setTimeout(() => {
    circle.classList.add("goTo_backAndforward");
  }, 50);

  backAndForwardTimeout = setTimeout(() => {
    circle.classList.remove("goTo_backAndforward");
  }, 600);
};

const centerdisplay = (circle) => {
  if (centerDisplayTimeout) {
    clearTimeout(centerDisplayTimeout);
    centerDisplayTimeout = null;
  }

  ChangeCircles.forEach((circle) => {
    circle.classList.remove("display_center");
  });
  setTimeout(() => {
    circle.classList.add("display_center");
  }, 50);

  centerDisplayTimeout = setTimeout(() => {
    circle.classList.remove("display_center");
  }, 600);
};

const showNowVolume = () => {
  if (centerDisplayTimeout) {
    clearTimeout(centerDisplayTimeout);
    centerDisplayTimeout = null;
  }
  const nowVolumeValue = Math.floor(video.volume * 100);
  nowVolume.innerText = `${nowVolumeValue}%`;

  nowVolume.classList.add("showing");

  centerDisplayTimeout = setTimeout(() => {
    nowVolume.classList.remove("showing");
  }, 600);
};
