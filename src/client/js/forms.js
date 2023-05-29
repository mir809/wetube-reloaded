document.addEventListener("DOMContentLoaded", () => {
  const inputFields = document.querySelectorAll(".input_box input");
  const labels = document.querySelectorAll(".input_box label");

  Array.from(inputFields).forEach((inputField, index) => {
    // 초기 실행
    handleInputBlur(inputField, labels[index]);

    // 이벤트 리스너 추가
    inputField.addEventListener("blur", () => {
      handleInputBlur(inputField, labels[index]);
    });
  });
});
function handleInputBlur(inputField, label) {
  const value = inputField.value;

  if (value === "") {
    // 값이 비어 있는 경우
    label.style.transform = "scale(1) translateY(0)";
    label.style.color = "rgba(0, 0, 0, 0.6)";
    label.style.animation = "bigger 0.1s ease-in-out forwards";
    label.style.backgroundColor = "transparent";
  } else {
    // 값이 비어 있지 않은 경우
    label.style.transform = "scale(0.7) translateY(-26px)";
    label.style.transformOrigin = "left";
    label.style.color = "rgba(0, 0, 0, 0.6)";
    label.style.backgroundColor = "white";
  }
}

const inputFields = document.querySelectorAll(".input_box input");
const labels = document.querySelectorAll(".input_box label");

Array.from(inputFields).forEach((inputField, index) => {
  inputField.addEventListener("focus", () => {
    //input클릭시 실행 (focus같은 역할)
    const value = inputField.value;
    if (value === "") {
      // input이 비어있을 때만
      labels[index].style.color = "#2196f3";
      labels[index].style.backgroundColor = "white";
      labels[index].style.animation = "smaller 0.1s ease-in-out forwards";
    }
  });
});

const pass = document.getElementById("pass");
const pass2 = document.getElementById("pass2");
const checkBox = document.getElementById("showPass");

checkBox.addEventListener("change", function () {
  if (checkBox.checked) {
    pass.type = "text";
    pass2.type = "text";
  } else {
    pass.type = "password";
    pass2.type = "password";
  }
});
