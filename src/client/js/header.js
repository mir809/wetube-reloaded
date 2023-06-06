const menuOpenBtn = document.querySelector(".menu_open_btn");
const menuBox = document.querySelector(".menu_box");
const uploadBtn = document.querySelector(".upload_btn");
const uploadBox = document.querySelector(".upload_box");

if (menuBox) {
  // menuBox가 있을 때만 = 로그인 상태일 때만 실행
  const menuBoxHandle = (event) => {
    if (
      event.target === menuOpenBtn ||
      event.target === menuOpenBtn.firstChild // 클릭된 요소가 menu_open_btn 또는 menu_open_btn의 첫번째 자식인 경우
    ) {
      menuBox.classList.toggle("hidden");
    }
  };

  const menuBoxHidden = (event) => {
    if (
      event.target === menuOpenBtn ||
      menuOpenBtn.contains(event.target) ||
      menuBox.contains(event.target)
    ) {
      return;
    } // 클릭된 요소가 menu_open_btn이거나
    // menu_open_btn 내부의 요소이거나
    // .menu_box 내부의 요소인 경우 처리하지 않음

    if (!menuBox.classList.contains("hidden")) {
      menuBox.classList.add("hidden");
    } // .menu_box가 보이는 상태라면 숨김 처리
  }; // => menuBox를 제외한 화면 아무 곳이나 클릭 시 숨김 처리

  menuOpenBtn.addEventListener("click", menuBoxHandle);
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
