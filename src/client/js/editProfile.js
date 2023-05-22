const nowAvatar = document.querySelector(".now_avatar");
const defaultImgs = Array.from(
  document.querySelectorAll(".profile_selector img")
); // 배열과 유사한 형태인 NodeList형태에서 실제 배열로 바꿔줌
const profileSelector = document.querySelector(".profile_selector");

const avatarInput = document.getElementById("avatar");

const submit = document.getElementById("submit");

if (nowAvatar.dataset.id === "defualt") {
  const findImgBySrc = (src) => {
    return defaultImgs.find((img) => img.getAttribute("src") === src);
  };
  const foundImg = findImgBySrc(nowAvatar.src);
  foundImg.classList.add("mark");
} // 사용자가 기본 프로필인 경우 기본 프로필 목록중에서
// 현재 사용중인 기본프로필 표시

avatarInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      nowAvatar.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    nowAvatar.src = "#";
  }
  const markedImg = document.querySelector(".mark");
  if (markedImg) {
    markedImg.classList.remove("mark");
  }
  // 기본 프로필에 mark 지워주기
}); // 유저가 직접 프로필 사진 선택시 해당 사진 표시

defaultImgs.forEach((img) => {
  img.addEventListener("click", function () {
    avatarInput.value = "";
    nowAvatar.src = img.src;
    const markedImg = document.querySelector(".mark");
    if (markedImg) {
      markedImg.classList.remove("mark");
    }
    this.classList.add("mark");
  });
}); // 기본 프로필 목록에서 특정 사진 클릭시 해당 사진 표시

const submitChange = async (event) => {
  //event.preventDefault();

  const findNowImg = (src) => {
    return defaultImgs.find((img) => img.getAttribute("src") === src);
  };

  const nowImg = findNowImg(nowAvatar.src);
  // 현재 화면상에서 표시된 이미지가 기본 프로필일경우에만
  // 값 반환
  const nowImgSrc = nowImg.src;
  if (nowImg) {
    //nowImg이 있을경우 실행

    await fetch(`/api/users/edit/avatar`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nowImgSrc }),
    });
  }
};

submit.addEventListener("click", submitChange);
