const videoBox = document.getElementById("videoBox");

const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");

const commentsNumberElement = document.querySelector(".comments_number");
let commentsNumber = parseInt(commentsNumberElement.dataset.id);

const addComment = (text, newCommentId, user) => {
  const videoComments = document.querySelector(".video_comments ul");

  const newComment = document.createElement("li");
  newComment.className = "video_comment";
  newComment.dataset.id = newCommentId;

  const avatarContainer = document.createElement("a");
  avatarContainer.href = `/users/${user._id}`;
  const avatar = document.createElement("img");
  avatar.className = "comment_avatar";

  if (user.socialOnly) {
    avatar.src = user.avatarUrl;
    avatar.crossOrigin = "anonymous";
  } else {
    if (user.defaultAvartar) {
      avatar.src = user.avatarUrl;
      avatar.crossOrigin = "anonymous";
    } else {
      avatar.src = `/${user.avatarUrl}`;
    }
  }

  avatarContainer.appendChild(avatar);

  const commentBox = document.createElement("div");
  commentBox.className = "comment_box";

  const commentBoxColumn1 = document.createElement("div");
  commentBoxColumn1.className = "comment_box_column";

  const commentOwner = document.createElement("div");
  commentOwner.className = "comment_owner";
  const commentOwnerName = document.createElement("a");
  commentOwnerName.className = "comment_owner_name";
  commentOwnerName.href = `/users/${user._id}`;
  commentOwnerName.innerText = user.name;
  const commentCreatedAt = document.createElement("span");
  commentCreatedAt.className = "comment_createAt";
  commentCreatedAt.dataset.id = Date.now();
  commentCreatedAt.innerText = "1초 전";

  commentOwner.appendChild(commentOwnerName);
  commentOwner.appendChild(commentCreatedAt);

  const commentText = document.createElement("span");
  commentText.className = "comment_text";
  commentText.innerText = text;

  const goodAndBad = document.createElement("div");
  goodAndBad.classList.add("goodAndBad");

  const goodBtn = document.createElement("div");
  goodBtn.classList.add("good_btn");
  goodAndBad.appendChild(goodBtn);

  const goodIcon = document.createElement("i");
  goodIcon.classList.add("far", "fa-thumbs-up");
  goodBtn.appendChild(goodIcon);

  const goodText = document.createElement("small");
  goodText.textContent = "좋아요";
  goodBtn.appendChild(goodText);

  const badBtn = document.createElement("div");
  badBtn.classList.add("bad_btn");
  goodAndBad.appendChild(badBtn);

  const badIcon = document.createElement("i");
  badIcon.classList.add("far", "fa-thumbs-up");
  badBtn.appendChild(badIcon);

  const badText = document.createElement("small");
  badText.textContent = "싫어요";
  badBtn.appendChild(badText);

  commentBoxColumn1.appendChild(commentOwner);
  commentBoxColumn1.appendChild(commentText);
  commentBoxColumn1.appendChild(goodAndBad);

  const commentBoxColumn2 = document.createElement("div");
  commentBoxColumn2.className = "comment_box_column";

  const commentConfigIcon = document.createElement("div");
  commentConfigIcon.className = "comment_config-icon";

  const dotIcon = document.createElement("i");
  dotIcon.className = "fas fa-ellipsis-vertical";
  commentConfigIcon.appendChild(dotIcon);

  const commentMenuBox = document.createElement("div");
  commentMenuBox.className = "comment_menu_box hidden";

  const editButton = document.createElement("div");
  editButton.className = "comment_menu_btn";
  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit";
  const editSpan = document.createElement("span");
  editSpan.innerText = "댓글 수정";
  editButton.appendChild(editIcon);
  editButton.appendChild(editSpan);
  commentMenuBox.appendChild(editButton);

  const deleteButton = document.createElement("div");
  deleteButton.className = "comment_menu_btn deleteComment";
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fas fa-trash-alt";
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "댓글 삭제";
  deleteButton.appendChild(deleteIcon);
  deleteButton.appendChild(deleteSpan);
  commentMenuBox.appendChild(deleteButton);

  const flagButton = document.createElement("div");
  flagButton.className = "comment_menu_btn";
  const flagIcon = document.createElement("i");
  flagIcon.className = "fas fa-flag";
  const flagSpan = document.createElement("span");
  flagSpan.innerText = "댓글 신고";
  flagButton.appendChild(flagIcon);
  flagButton.appendChild(flagSpan);
  commentMenuBox.appendChild(flagButton);

  commentConfigIcon.appendChild(commentMenuBox);

  commentBoxColumn2.appendChild(commentConfigIcon);

  commentBox.appendChild(commentBoxColumn1);
  commentBox.appendChild(commentBoxColumn2);

  newComment.appendChild(avatarContainer);
  newComment.appendChild(commentBox);

  videoComments.prepend(newComment);

  // commentConfigIcon을 commentConfigIcons에 추가
  const commentConfigIcons = Array.from(
    document.querySelectorAll(".comment_config-icon i")
  );
  const newCommentConfigIcon = newComment.querySelector(
    ".comment_config-icon i"
  );
  commentConfigIcons.push(newCommentConfigIcon);

  // 클릭 이벤트 연결
  newCommentConfigIcon.addEventListener("click", () => {
    if (commentMenuBox.classList.contains("hidden")) {
      commentMenuBox.classList.remove("hidden");
      document.addEventListener("click", outsideClickListener);
    } else {
      commentMenuBox.classList.add("hidden");
      document.removeEventListener("click", outsideClickListener);
    }
  });

  const outsideClickListener = (event) => {
    const isClickInside =
      newCommentConfigIcon.contains(event.target) ||
      commentMenuBox.contains(event.target);

    if (!isClickInside) {
      commentMenuBox.classList.add("hidden");
      document.removeEventListener("click", outsideClickListener);
    }
  };
};

const commentSubmit = async (event) => {
  event.preventDefault();

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
    const { newCommentId, user } = await response.json();
    addComment(text, newCommentId, user);
    commentsNumber += 1;
    commentsNumberElement.innerText = commentsNumber;
  }
  selectCancel();
  //댓글 입력시 댓글입력란 선택취소
};

const commentDelete = async (event) => {
  const deleteButton = event.target.closest(".deleteComment");
  if (deleteButton) {
    const deleteId = deleteButton.parentElement.dataset.id;
    const videoId = videoBox.dataset.id;
    const response = await fetch(`/api/videos/${videoId}/comment`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deleteId }),
    });

    if (response.status === 201) {
      const delLi = deleteButton.closest("li.video_comment");
      delLi.remove();
      commentsNumber -= 1;
      commentsNumberElement.innerText = commentsNumber;
    }
  }
};

const videoComments = document.querySelector(".video_comments");
videoComments.addEventListener("click", commentDelete);

if (form) {
  form.addEventListener("submit", commentSubmit);
}

//---------------------------------

const formBtns = document.querySelector(".comment_form_btns");
const addBtn = document.querySelector(".add_btn");
const removeBtn = document.querySelector(".remove_btn");

textarea.addEventListener("input", () => {
  textarea.style.height = "0px";
  textarea.style.height = `${textarea.scrollHeight}px`; // 텍스트 내용에 맞게 높이 조정
});

textarea.addEventListener("focus", function () {
  // textarea가 선택되었을 때 실행되는 코드
  btnDisabled();
  formBtns.classList.remove("hidden");
});

textarea.addEventListener("blur", function () {
  // textarea의 선택이 해제될 때 실행되는 코드
});

const btnDisabled = () => {
  if (textarea.value.trim() !== "") {
    addBtn.disabled = false;
  } else {
    addBtn.disabled = true;
  }
};

const selectCancel = () => {
  formBtns.classList.add("hidden");
  textarea.blur();
  textarea.value = "";
};

textarea.addEventListener("input", btnDisabled);
removeBtn.addEventListener("click", selectCancel);

const commentConfigIcons = document.querySelectorAll(".comment_config-icon i");

commentConfigIcons.forEach((commentConfigIcon) => {
  const commentMenuBox =
    commentConfigIcon.parentNode.querySelector(".comment_menu_box");

  if (commentMenuBox) {
    commentConfigIcon.addEventListener("click", () => {
      if (commentMenuBox.classList.contains("hidden")) {
        commentMenuBox.classList.remove("hidden");
        document.addEventListener("click", outsideClickListener);
      } else {
        commentMenuBox.classList.add("hidden");
        document.removeEventListener("click", outsideClickListener);
      }
    });

    const outsideClickListener = (event) => {
      const isClickInside =
        commentConfigIcon.contains(event.target) ||
        commentMenuBox.contains(event.target);

      if (!isClickInside) {
        commentMenuBox.classList.add("hidden");
        document.removeEventListener("click", outsideClickListener);
      }
    };
  }
});
