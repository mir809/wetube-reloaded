const nowAvatar = document.querySelector(".now_avatar");
const defaultImgs = Array.from(
  document.querySelectorAll(".profile_selector div img")
); // 배열과 유사한 형태인 NodeList형태에서 실제 배열로 바꿔줌
const profileSelector = document.querySelector(".profile_selector");

const avatarInput = document.getElementById("avatar");

if (nowAvatar.dataset.id === "defualt") {
  const findImgBySrc = (src) => {
    return Array.from(defaultImgs).find(
      (img) => img.getAttribute("src") === src
    );
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
}); // 유저가 직접 프로필 사진 선택시 해당 사진 표시

defaultImgs.forEach((img) => {
  img.addEventListener("click", function () {
    nowAvatar.src = img.src;
    const markedImg = document.querySelector(".mark");
    if (markedImg) {
      markedImg.classList.remove("mark");
    }
    this.classList.add("mark");
  });
}); // 기본 프로필 목록에서 특정 사진 클릭시 해당 사진 표시
