const videoCreateAtElements = document.querySelectorAll(".video_createAt");
const newVideoElements = document.querySelectorAll(".new_video");

// 밀리초를 분, 시간, 일, 주, 월, 년 단위로 변환
const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;
const month = 30 * day;
const year = 365 * day;

if (videoCreateAtElements.length > 0) {
  // .video_createAt 객체가 1개라도 있으면 실행
  videoCreateAtElements.forEach((element) => {
    const createdAt = element.getAttribute("data-id");
    const formattedTime = formatVideoCreateTime(createdAt, new Date()); // 현재 시간을 함수에 전달
    element.textContent = formattedTime;

    if (formattedTime.includes("시간") && newVideoElements.length > 0) {
      //.new_video 객체가 1개라도 있으면 실행
      // 시간 표시하는 글씨에서 단위 확인
      const elapsed = new Date() - new Date(createdAt); // 경과 시간(밀리초 단위) 계산
      const elapsedHour = Math.floor(elapsed / hour);

      if (elapsedHour >= 1) {
        // 단위 앞에 붙는 숫자가 해당 조건 이상일경우
        // hidden클래스 추가
        //=> 1시간 이상인경우
        newVideoElements.forEach((newVideoElement) => {
          newVideoElement.classList.add("hidden");
        });
      }
    }
  });
}

function formatVideoCreateTime(createdAt, currentTime) {
  const created = new Date(createdAt); // 비디오 생성 시간

  const elapsed = currentTime - created; // 경과 시간(밀리초 단위)

  if (elapsed < minute) {
    // 1분 미만
    return `${Math.floor(elapsed / 1000)}초 전`;
  } else if (elapsed < hour) {
    // 1시간 미만
    return `${Math.floor(elapsed / minute)}분 전`;
  } else if (elapsed < day) {
    // 1일 미만
    return `${Math.floor(elapsed / hour)}시간 전`;
  } else if (elapsed < week) {
    // 1주일 미만
    return `${Math.floor(elapsed / day)}일 전`;
  } else if (elapsed < month) {
    // 1달 미만
    return `${Math.floor(elapsed / week)}주 전`;
  } else if (elapsed < year) {
    // 1년 미만
    return `${Math.floor(elapsed / month)}개월 전`;
  } else {
    // 1년 이상
    return `${Math.floor(elapsed / year)}년 전`;
  }
}
/*
ex) 1시간 지나면 '새동영상' 숨김
if (formattedTime.includes("일") && newVideoElements.length > 0) {
  const elapsedHours = Math.floor(elapsed / hour);
  if (elapsedHours >= 1) {
    newVideoElements.forEach((newVideoElement) => {
      newVideoElement.classList.add("hidden");
    });
  }
}
*/
