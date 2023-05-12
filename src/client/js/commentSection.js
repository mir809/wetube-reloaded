const videoBox = document.getElementById("videoBox");

const form = document.getElementById("commentForm");

const addComment = (text) => {
  const videoComments = document.querySelector(".video_comments ul");
  // watch페이지(html)에 있는 .video_comments의 ul을 가져옴
  const newComment = document.createElement("li");
  newComment.className = "video_comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  // html객체 생성 (li,i,span),
  // wathc페이지에 생성한 객체와 똑같이 class 부여
  span.innerText = text;

  newComment.appendChild(icon);
  newComment.appendChild(span);
  videoComments.prepend(newComment);
};

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
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    // fetch(request)의 응답 결과에서 status 코드를 받음
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  if (status === 201) {
    addComment(text);
  }
};

if (form) {
  form.addEventListener("submit", commentSubmit);
}
