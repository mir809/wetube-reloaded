const videoInput = document.getElementById("video");
const videoElement = document.getElementById("selected_video");
const videoBox = document.getElementById("video_box");
const thumbColumn = document.getElementById("thumb_column");

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

// 제목 입력칸
const titleBox = document.querySelector(".title_box");
const titleArea = document.getElementById("title_area");
const titleMax = document.getElementById("title_max");
const titleAreaHeigth = titleArea.scrollHeight + "px";

titleArea.style.height = titleAreaHeigth;

titleBox.addEventListener("click", () => {
  titleArea.focus();
});

titleArea.addEventListener("input", () => {
  titleArea.style.height = titleAreaHeigth;
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
});

//영상 설명 입력칸
const desBox = document.querySelector(".des_box");
const desArea = document.getElementById("des_area");
const desMax = document.getElementById("des_max");
const desAreaHeigth = desArea.scrollHeight + "px";

desArea.style.height = desAreaHeigth;

desBox.addEventListener("click", () => {
  desArea.focus();
});

desArea.addEventListener("input", () => {
  desArea.style.height = desAreaHeigth;
  desArea.style.height = desArea.scrollHeight + "px";

  let remainingChars = desArea.value.length;
  if (remainingChars > 2000) {
    desArea.value = desArea.value.slice(0, -1);
    remainingChars -= 1;
  }
  desMax.textContent = remainingChars.toString();
});

const hashtagBox = document.querySelector(".hashtag_box");
const hashtagInput = hashtagBox.querySelector("input");

hashtagBox.addEventListener("click", () => {
  hashtagInput.focus();
});

const submit = document.querySelector(".submit");
const errorMessage = document.getElementById("none_select");

submit.addEventListener("click", (event) => {
  errorMessage.innerText = "";
  // 아무것도 아니면 글씨 지워줌

  if (!thumbInput.value) {
    event.preventDefault(); // 폼 제출을 막음

    errorMessage.innerText = "썸네일 이미지가 선택되지 않았습니다.";
  }
  if (!videoInput.value) {
    event.preventDefault(); // 폼 제출을 막음

    errorMessage.innerText = "동영상 파일이 선택되지 않았습니다.";
  }
});
