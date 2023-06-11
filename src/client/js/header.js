const menuOpenBtn = document.querySelector(".menu_open_btn");
const menuBox = document.getElementById("menuBox");
const uploadBtn = document.querySelector(".upload_btn");
const uploadBox = document.querySelector(".upload_box");

const themaSelectBtn = document.getElementById("themaSelectBtn");
const themaSelector = document.getElementById("themaSelector");
const backIcon = document.getElementById("backIcon");

const whiteBtn = document.getElementById("white");
const blackBtn = document.getElementById("black");

let themmColor;

const menuBoxHandle = (event) => {
  if (
    event.target === menuOpenBtn ||
    event.target === menuOpenBtn.firstChild // 클릭된 요소가 menu_open_btn 또는 menu_open_btn의 첫번째 자식인 경우
  ) {
    menuBox.classList.toggle("hidden");
    themaSelector.classList.add("hidden");
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

const shortcutBtn = document.getElementById("shortcutBtn");
const shortcut = document.querySelector(".shortcut");
const shortcutBox = document.querySelector(".shortcut_box");
const closeButton = shortcutBox.querySelector(".close_btn");

const shortcutDisplay = () => {
  shortcut.classList.remove("hidden");
  menuBox.classList.add("hidden");
};

shortcutBtn.addEventListener("click", shortcutDisplay);

function hideShortcut() {
  shortcut.classList.add("hidden");
}

shortcut.addEventListener("click", hideShortcut);
closeButton.addEventListener("click", hideShortcut);
shortcutBox.addEventListener("click", function (event) {
  event.stopPropagation();
});

const handleThemaSelector = () => {
  menuBox.classList.add("hidden");
  themaSelector.classList.remove("hidden");
};
themaSelectBtn.addEventListener("click", handleThemaSelector);
// 테마선택버튼 클릭시 기존 메뉴박스 사라지고 테마선택창 나타남

const backToMenuBox = () => {
  event.stopPropagation();
  menuBox.classList.remove("hidden");

  themaSelector.classList.add("hidden");
  //menuOpenBtn.click();
};
backIcon.addEventListener("click", backToMenuBox);

const themaChangeWhite = async () => {
  if (!whiteBtn.classList.contains("select")) {
    // `.select` 클래스가 없는 경우에만 실행할 코드 작성

    themmColor = "white";

    const response = await fetch(`/api/theme/${themmColor}`, {
      method: "post",
    });
    if (response.status === 201) {
      location.reload();
    }
  }
};

whiteBtn.addEventListener("click", themaChangeWhite);

const themaChangeBlack = async () => {
  if (!blackBtn.classList.contains("select")) {
    // `.select` 클래스가 없는 경우에만 실행할 코드 작성

    themmColor = "black";

    const response = await fetch(`/api/theme/${themmColor}`, {
      method: "post",
    });
    if (response.status === 201) {
      location.reload();
    }
  }
};

blackBtn.addEventListener("click", themaChangeBlack);
