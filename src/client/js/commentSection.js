const videoBox = document.getElementById("videoBox");

const form = document.getElementById("commentForm");

const commentSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");

  const text = textarea.value;
  const videoId = videoBox.dataset.id;
  // 댓글 작성중인 동영상의 id받아옴

  fetch(`/api/videos/${videoId}/comment`, {
    method: "post",
    body: {
      text,
    },
  });
};

if (form) {
  form.addEventListener("submit", commentSubmit);
}
