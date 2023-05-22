const videoBox = document.getElementById("videoBox");

const form = document.getElementById("commentForm");

const addComment = (text, newCommentId) => {
  const videoComments = document.querySelector(".video_comments ul");
  // watch페이지(html)에 있는 .video_comments의 ul을 가져옴
  const newComment = document.createElement("li");
  newComment.className = "video_comment";
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  span2.className = "deleteComment";
  // html객체 생성 (li,i,span),
  // wathc페이지에 생성한 객체와 똑같이 class 부여
  span.innerText = text;
  span2.innerText = "❌";

  newComment.dataset.id = newCommentId;
  // 프론트엔드에서 자체적으로 추가한 댓글에 id 추가
  // => 생성 후 바로 삭제 가능

  newComment.appendChild(span);
  newComment.appendChild(span2);

  videoComments.prepend(newComment);
};

const commentSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");

  const text = textarea.value;

  const videoId = videoBox.dataset.id;
  // 댓글을 작성한 동영상의 id받아옴
  if (text.trim() === "") {
    return;
  } /* 댓글입력칸이 비어있을 때 or 스페이스바만 입력시
   그대로 함수 종료  => 아래에 있는 코드실행(request 요청) X */
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    // fetch(request)의 응답 결과에서 status 코드를 받음
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const commentDelete = async (event) => {
  if (event.target.className === "deleteComment") {
    const deleteId = event.target.parentElement.dataset.id;
    const videoId = videoBox.dataset.id;
    const response = await fetch(`/api/videos/${videoId}/comment`, {
      // fetch(request)의 응답 결과에서 status 코드를 받음
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deleteId }),
    });

    if (response.status === 201) {
      const delLi = event.target.parentElement;
      delLi.remove();
    }
  }
};

if (form) {
  form.addEventListener("submit", commentSubmit);
}

window.addEventListener("click", commentDelete);
