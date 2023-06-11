const smallPlayer = document.querySelector(".small_player");
const video = document.querySelector(".small_player video");
const smallPlayerDeleteBtn = document.getElementById("smallPlayerDelete");

const videoBox = document.querySelector(".dispaly_box");

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

let playAgain = false;

const redColor = getComputedStyle(document.documentElement).getPropertyValue(
  "--red-color"
);
const beforeColor = `rgba(255, 255, 255, 0.3)`;
// 타임라인 막대에 넣어줄 색깔

if (smallPlayer) {
  //소형 플레이어가 존재 할 경우에만 작동

  const mutedWhether = document.getElementById("dummy_box1");
  const volumeSize = document.getElementById("dummy_box2");
  const DummyMuteWhether = document.getElementById("dummy_box3");

  const time = smallPlayer.dataset.id;
  video.currentTime = time;
  // 이전 시간 그대로 넣기

  const muted = Boolean(mutedWhether.dataset.id);
  let DummyMute = Boolean(DummyMuteWhether.dataset.id);

  let roundValue;
  // volumeValue에 값이 이상한 소수점으로 변하는 현상 방지

  const preVolume = Number(volumeSize.dataset.id);

  let volumeValue = preVolume; // 볼륨 초기값
  video.volume = volumeValue; // 영상의 실제 소리

  if (muted) {
    video.muted = true;
  } else {
    video.muted = false;
  }

  // 초기상태
  //--------------------

  const playBtn = document.getElementById("play");
  const playBtnIcon = playBtn.querySelector("i");
  const playBtnText = playBtn.querySelector(".text_box");

  // 모든 div.display_change_circle 요소를 선택하여 NodeList로 반환
  const ChangeCircles = document.querySelectorAll(".display_change_circle");

  // 개별적으로 선택된 요소에 접근하여 조작
  const leftCircle = ChangeCircles[0];
  const playCircle = ChangeCircles[1];
  const playCircleIcon = playCircle.querySelector("i");
  const rightCircle = ChangeCircles[2];
  const muteCircle = ChangeCircles[3];
  const muteCircleIcon = muteCircle.querySelector("i");
  const nowVolume = document.querySelector(".now_volume");

  let backAndForwardTimeout = null; // 시간 앞,뒤로가기 표시
  let centerDisplayTimeout; // 음소거,해제 or 재생,정지

  const returnWatch = document.getElementById("returnWatch");
  const videoId = returnWatch.dataset.id;
  // 영상 id

  //-------------------------

  const smallPlayeClear = async (event) => {
    const response = await fetch(`/api/small/clear`, {
      method: "post",
    });
    if (response.status === 201) {
      smallPlayer.remove();
    }
  };

  smallPlayerDeleteBtn.addEventListener("click", smallPlayeClear);
  // 소형 플레이어 X버튼 클릭시 제거

  const refreshPage = () => {
    smallPlayerDeleteBtn.click();
  };

  //window.addEventListener("beforeunload", refreshPage);
  //  + 새로고침 시에도 제거

  //---------------------------------------
  // 상태변화 애니메이션

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

  // 상태변화 애니메이션
  //--------------------------------
  // 타임라인, 영상 시간

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
    // 비디오 재생시 현재시간 표시
    currentTime.innerText = formatTime(Math.floor(video.currentTime));

    timeline.value = Math.floor(video.currentTime);

    timelineColor();
  };

  const loadedMetaData = async () => {
    currentTime.innerText = formatTime(
      Math.floor(video.duration) - Math.floor(video.duration)
    ); // 시작시 동영상 현재시간 = 전체시간 - 전체시간
    totalTime.innerText = formatTime(Math.floor(video.duration));
    // 영상 전체시간

    timeline.max = await Math.floor(video.duration);
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

  video.addEventListener("timeupdate", timeUpdate);
  if (video.readyState >= 2) {
    loadedMetaData();
  } else {
    video.addEventListener("loadedmetadata", loadedMetaData);
  }
  //비디오 '재생시간/전체시간'

  timeline.addEventListener("click", (event) => {
    event.stopPropagation(); // 이벤트 버블링을 중지시킴
  });
  timeline.addEventListener("input", timelineInput);
  timeline.addEventListener("change", timelineChange);
  // 비디오 타임라인 조절 막대

  const timelineColor = () => {
    const value = timeline.value;
    const max = timeline.max;
    const percent = (value / max) * 100;

    timeline.style.background = `linear-gradient(to right, ${redColor} ${percent}%, ${beforeColor} ${percent}%)`;
  };

  timeline.addEventListener("input", timelineColor);

  // 영상 재생/일시정지
  const clickPlayBtn = () => {
    centerdisplay(playCircle);

    playAgain = video.paused;
    video.paused ? video.play() : video.pause();
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
    playCircleIcon.classList = video.paused ? "fas fa-pause" : "fas fa-play";

    playBtnText.innerText = video.paused ? "재생(Space)" : "일시중지(Space)";
  }; //버튼 클릭시

  playBtn.addEventListener("click", clickPlayBtn);
  playBtnIcon.addEventListener("click", clickPlayBtn);
  videoBox.addEventListener("click", clickPlayBtn);

  const pauseWhether = Boolean(video.dataset.id);
  // 이전 정지/재생 여부
  if (!pauseWhether) {
    clickPlayBtn();
  }

  const videoEnd = async () => {
    // 비디오 재생이 끝난경우 (시청 후)\

    const response = await fetch(`/api/videos/${videoId}/view`, {
      method: "post",
    }); // 동영상 조회수 증가

    playBtnIcon.classList = "fas fa-redo-alt";

    playBtnText.innerText = "다시 보기(space)";

    // 동영상재생버튼 -> '다시시작'으로 변경
  };
  video.addEventListener("ended", videoEnd);
  // 비디오 시청 후 조회수 증가

  // 컨트롤러 기본기능
  // -------------------------------------

  // 키보드 단축키

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
        roundValue = volumeValue;

        if (video.muted === true && DummyMute === false) {
          // 음소거 버튼에 의한 음소거 상태인 경우
          // : 음소거 상태 유지 + 값 저장만

          if (video.volume === 0) {
            volumeValue = 0.05;
            video.volume = volumeValue;
          } else {
            roundValue += 0.05;
            volumeValue = Math.round(roundValue * 100) / 100;
            maxVolume();

            video.volume = volumeValue;
          }
        } else if (video.muted === true && DummyMute === true) {
          // 음소거 버튼 클릭이 아닌 방향키로 인한 음소거 상태인경우
          // 바로 음소거 해제 + 값 0.1로 고정
          video.muted = false;
          DummyMute = false;
          muteCircleIcon.classList = "fas fa-volume-up";

          if (video.volume === 0) {
            volumeValue = 0.05;
            video.volume = volumeValue;
          } else {
            roundValue += 0.05;
            volumeValue = Math.round(roundValue * 100) / 100;
            maxVolume();

            video.volume = volumeValue;
          }
        } else if (video.muted === false) {
          // 음소거 상태가 아닌경우 : 실시간 반영
          roundValue += 0.05;
          volumeValue = Math.round(roundValue * 100) / 100;
          maxVolume();
          video.volume = volumeValue; //실제 볼륨
        }
      }
      centerdisplay(muteCircle);
      showNowVolume();
    }
    if (event.code === "ArrowDown") {
      // 아래쪽 방향키 : 음량 - 10%
      event.preventDefault();
      if (volumeValue > 0) {
        roundValue = volumeValue;

        // 볼륨이 0보다 크면 줄임
        const lastVolume = volumeValue;

        roundValue -= 0.05;
        volumeValue = Math.round(roundValue * 100) / 100;
        if (volumeValue < 0.01) {
          volumeValue = 0;
          // 만약 줄이게되서 0이하가 되면 0으로 고정
        }
        video.volume = volumeValue; //실제 볼륨
        //음소거 상태인 경우 값만 기억

        if (volumeValue === 0) {
          if (!video.muted) {
            // 비디오가 음소거 상태가 아니였을 때만
            DummyMute = true;
            // 방향키에 의한 음소거 표시
          }

          video.muted = true;
          muteCircleIcon.classList = "fas fa-volume-mute";

          volumeValue = lastVolume;
        }
      }
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
      if (video.muted) {
        video.muted = false;
        DummyMute = false;
        video.volume = volumeValue;
      } else {
        video.muted = true;
      }

      muteCircleIcon.classList = video.muted
        ? "fas fa-volume-mute"
        : "fas fa-volume-up";

      centerdisplay(muteCircle);
      showNowVolume();
    } // M : 음소거/음소거 해제

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

    if (event.code === "KeyI") {
      // 소형 플레이어 단축키

      returnWatch.click();
    } // I : 소형 플레이어
  };

  let ThisVideoBox = false;

  const vidoeBoxClick = (event) => {
    //비디오 박스 클릭시에만 활성화되는 키보드 단축키
    ThisVideoBox = true;
  };

  const windowClick = (event) => {
    //화면 클릭시
    if (
      event.target.tagName.toLowerCase() === "input" ||
      event.target.tagName.toLowerCase() === "textarea"
    ) {
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

  //----------------------------------------
  // 영상 시청화면 복귀
  const returnWatchPage = async (event) => {
    event.stopPropagation();
    // 소형플레이어 기능 실행시
    const videoTime = video.currentTime;
    // 영상 현재 시간
    const videoPaused = video.paused;
    // 영상 재생/정지 여부
    const videoMuted = video.muted;

    // 음소거 여부 + 방향키에 의한 음소거인지 여부
    // DummyMute= true : 방향키로 음소거

    const response = await fetch(`/api/return-watch/${videoId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoTime,
        videoPaused,
        volumeValue,
        videoMuted,
        DummyMute,
      }),
    });
    // 영상 현재시간, 정지/재생 여부, 음소거 여부, 음량
    if (response.status === 201) {
      window.location.href = `/videos/${videoId}`;
    }
  };
  returnWatch.addEventListener("click", returnWatchPage);
}
