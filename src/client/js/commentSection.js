const videoBox = document.getElementById("videoBox");

const form = document.getElementById("commentForm");

const commentSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");

  const text = textarea.value;
  const videoId = videoBox.dataset.id;
  // 댓글 작성중인 동영상의 id받아옴
  if (text.trim() === "") {
    return;
  } /* 댓글입력칸이 비어있을 때 or 스페이스바만 입력시
   그대로 함수 종료  => 아래에 있는 코드실행(request 요청) X */
  await fetch(`/api/videos/${videoId}/comment`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  window.location.reload();
  // 새로고침 해줌
};

if (form) {
  form.addEventListener("submit", commentSubmit);
}
