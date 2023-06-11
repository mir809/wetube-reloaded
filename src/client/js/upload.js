const videoInput = document.getElementById("video");
const videoElement = document.getElementById("selected_video");
const videoBox = document.getElementById("video_box");
const thumbColumn = document.getElementById("thumb_column");

if (videoInput) {
  // videoInput 있을 때만 == upload 페이지에서만
  videoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const videoURL = URL.createObjectURL(file);
    videoElement.src = videoURL;
    videoBox.style.border = "none";
    thumbColumn.classList.remove("hidden");
  });

  const thumbInput = document.getElementById("thumb");
  const thumbImage = document.getElementById("selected_thumb");
  const thumbBox = document.getElementById("thumb_box");

  thumbInput.addEventListener("change", () => {
    const file = thumbInput.files[0];
    const imageURL = URL.createObjectURL(file);
    thumbBox.style.border = "none";

    thumbImage.src = imageURL;
    thumbImage.classList.remove("hidden");
  });
}

// 제목 입력칸
const titleBox = document.querySelector(".title_box");
const titleArea = document.getElementById("title_area");
const titleMax = document.getElementById("title_max");
const titleAreaHeight = titleArea.scrollHeight + "px";

titleArea.style.height = titleAreaHeight;
// 텍스트 입력 시 이벤트 핸들러
const handleTitleInput = () => {
  titleArea.style.height = titleAreaHeight;
  titleArea.style.height = titleArea.scrollHeight + "px";

  let remainingChars = titleArea.value.length;
  if (remainingChars > 100) {
    titleArea.value = titleArea.value.slice(0, -1);
    remainingChars -= 1;
  }
  titleMax.textContent = remainingChars.toString();

  const text = titleArea.value;
  const modifiedText = text.replace(/\n/g, ""); // 줄바꿈을 제거하는 정규식 패턴 사용

  if (text.includes("\n")) {
    titleArea.style.height = `${titleArea.scrollHeight - 20}px`;
    remainingChars = titleArea.value.length - 1;
    titleMax.textContent = remainingChars.toString();
  }

  // 수정된 텍스트를 다시 입력란에 설정합니다.
  titleArea.value = modifiedText;
};

// 텍스트 입력 시 이벤트 핸들러를 직접 호출하여 초기화합니다.
handleTitleInput();

titleBox.addEventListener("click", () => {
  titleArea.focus();
});

titleArea.addEventListener("input", handleTitleInput);

// 영상 설명 입력칸
const desBox = document.querySelector(".des_box");
const desArea = document.getElementById("des_area");
const desMax = document.getElementById("des_max");
const desAreaHeight = desArea.scrollHeight + "px";

// 텍스트 입력 시 이벤트 핸들러
const handleDesInput = () => {
  desArea.style.height = desAreaHeight;
  desArea.style.height = desArea.scrollHeight + "px";

  let remainingChars = desArea.value.length;
  if (remainingChars > 2000) {
    desArea.value = desArea.value.slice(0, -1);
    remainingChars -= 1;
  }
  desMax.textContent = remainingChars.toString();
};

// 텍스트 입력 시 이벤트 핸들러를 직접 호출하여 초기화합니다.
handleDesInput();

desBox.addEventListener("click", () => {
  desArea.focus();
});

desArea.addEventListener("input", handleDesInput);

// 해쉬태그 입력박스
const hashtagBox = document.querySelector(".hashtag_box");
const hashtagInput = hashtagBox.querySelector("input");

hashtagBox.addEventListener("click", () => {
  hashtagInput.focus();
});

//-------------------- 동영상 수정 페이지---------------------

const video = document.querySelector("video");
const totalTime = document.getElementById("totalTime");

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

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  // 영상 전체시간
};

if (totalTime && video.readyState >= 2) {
  handleLoadedMetadata();
} else {
  video.addEventListener("loadedmetadata", handleLoadedMetadata);
}
