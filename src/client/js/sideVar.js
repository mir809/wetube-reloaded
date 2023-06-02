const changeBtns = document.querySelectorAll(".side-var_OnOff-btn");

const sideSection = document.querySelector(".side_var-section");
const sideVar = document.querySelector(".side_var");
const sideVarMini = document.querySelector(".side_var-mini");

const fullSideVar = document.querySelector(".side_var-fullscreen");

const mainContent = document.querySelector(".content");

let isRotated = false;

if (sideVarMini) {
  const sideVarChange = () => {
    if (isRotated) {
      changeBtns.forEach((btn) => {
        btn.classList.remove("rotate");
        btn.classList.add("rotateReverse");
      });
      isRotated = false;
      sideVar.classList.toggle("hidden");
      sideVarMini.classList.toggle("hidden");
      mainContent.style.paddingLeft = "230px";
    } else {
      changeBtns.forEach((btn) => {
        btn.classList.add("rotate");
        btn.classList.remove("rotateReverse");
      });
      isRotated = true;
      sideVar.classList.toggle("hidden");
      sideVarMini.classList.toggle("hidden");
      mainContent.style.paddingLeft = "72px";
    }
  };

  changeBtns.forEach((btn) => {
    btn.addEventListener("click", sideVarChange);
  });
}

if (fullSideVar) {
  const sideVarChange = () => {
    if (isRotated) {
      changeBtns.forEach((btn) => {
        btn.classList.remove("rotate");
        btn.classList.add("rotateReverse");
      });
      isRotated = false;
      sideVar.classList.add("hiding");
      sideVar.classList.remove("displaying");
      fullSideVar.classList.toggle("hidden");
    } else {
      changeBtns.forEach((btn) => {
        btn.classList.add("rotate");
        btn.classList.remove("rotateReverse");
      });
      isRotated = true;
      sideVar.classList.remove("hiding");
      sideVar.classList.add("displaying");
      fullSideVar.classList.toggle("hidden");
    }
  };

  changeBtns.forEach((btn) => {
    btn.addEventListener("click", sideVarChange);
  });

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (isRotated) {
      if (target === fullSideVar) {
        sideVarChange();
      }
    }
  });

  document.addEventListener(
    "wheel",
    function (event) {
      if (isRotated) {
        if (event.target === fullSideVar) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },
    { passive: false }
  );
}
