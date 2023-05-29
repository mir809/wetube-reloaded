const avatar = document.querySelector(".header_avatar");
const menuBox = document.querySelector(".menu_box");
const uploadBtn = document.querySelector(".upload_btn");
const uploadBox = document.querySelector(".upload_box");

if (menuBox) {
  //menuBox가 있을 때만 = 로그인 상태일 때만 실행
  const menuBoxHandle = () => {
    menuBox.classList.toggle("hidden");
  };

  const menuBoxHidden = (event) => {
    if (event.target === avatar || menuBox.contains(event.target)) {
      return;
    } // 클릭된 요소가 .header_avatar 이거나
    // .menu_box 내부의 요소인 경우 처리하지 않음

    if (!menuBox.classList.contains("hidden")) {
      menuBox.classList.add("hidden");
    } // .menu_box가 보이는 상태라면 숨김 처리
  }; // => menuBox를 제외한 화면 아무곳이나 클릭시 숨김처리

  avatar.addEventListener("click", menuBoxHandle);
  window.addEventListener("click", menuBoxHidden);
}

if (uploadBtn) {
  const uploadBoxHandle = () => {
    uploadBox.classList.toggle("hidden");
  };
  const uploadBoxHidden = (event) => {
    if (event.target === uploadBtn || uploadBtn.contains(event.target)) {
      return;
    }
    if (!uploadBox.classList.contains("hidden")) {
      uploadBox.classList.add("hidden");
    }
  };

  uploadBtn.addEventListener("click", uploadBoxHandle);
  window.addEventListener("click", uploadBoxHidden);
}
