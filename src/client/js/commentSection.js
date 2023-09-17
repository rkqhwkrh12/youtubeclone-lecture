//프론트엔드에서 작업하기 위해서 client/js에 추가함
const videoContainer = document.getElementById("videoContainer"); // 여기서 받아온 video 아이디를 이용해서 어떤 비디오에 댓글이 달렸는지 판단.
const form = document.getElementById("commentForm"); //watch.pug에 있는 form을 이용하기 위해서 id를 가지고 옴.
const textarea = form.querySelector("textarea"); //달린 댓글을 컨트롤하기 위해서
const btn = form.querySelector("button");

const handleSubmit = (event) => {
  event.preventDefault();
  const text = textarea.value; //달린 댓글 컨트롤
  const video = videoContainer.dataset.id; //어떤 비디오에 추가 되었는지
};

//click으로 하면 button이 자동으로 제출해버려서 
//submit속성으로 지정함.
form.addEventListener("submit", handleSubmit);