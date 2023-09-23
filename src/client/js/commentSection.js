import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
//comment삭제를 위한 코드
const videoComments = document.querySelector(".video__comments li");
//달리는 댓글 모두에 대해서 컨트롤 하기 위해서 queryselectorAll 사용.
const deletIcon = document.querySelectorAll(".delete_icon");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const deletIcon = document.createElement("span");
  deletIcon.innerText = "❌";
  deletIcon.className = "delete_icon";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(deletIcon);
  videoComments.prepend(newComment);

  deletIcon.addEventListener("click", handleDelete);
};

//여기서 부터 시작
const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value; 
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
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

const handleDelete = async (event) => {
  const deleteComment = event.target.parentElement;

  const {
    dataset: { id },
  } = event.target.parentElement;

  const videoId = videoContainer.dataset.id;

  const response = await fetch(`/api/videos/${videoId}/comment/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId: id }),
  });

  if (response.status === 200) {
    deleteComment.remove();
  }
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deletIcon) {
  deletIcon.forEach((icon) => icon.addEventListener("click", handleDelete));
}