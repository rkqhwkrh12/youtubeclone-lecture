//프론트엔드에서 작업하기 위해서 client/js에 추가함
const videoContainer = document.getElementById("videoContainer"); // 여기서 받아온 video 아이디를 이용해서 어떤 비디오에 댓글이 달렸는지 판단.
const form = document.getElementById("commentForm"); //watch.pug에 있는 form을 이용하기 위해서 id를 가지고 옴.


const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value; //달린 댓글 컨트롤
  const videoId = videoContainer.dataset.id; //어떤 비디오에 추가 되었는지

  if (text === "" || text.trim() === "") {
        return;
    }
  //작성한 댓글을 backend로 보내야 함.
  //그러기 위해서 router에 post를 추가해 주어야 한다.
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({text}), //middleware에서 json을 설정해 주어야 사용가능.
  });
  textarea.value = ""; //댓글을 제출하고 난 다음 빈 칸이 되게 설정.
};

//click으로 하면 button이 자동으로 제출해버려서 
//submit속성으로 지정함.
//login 되어 있을때만 댓글을 달 수 있는 창이 나와야 하므로 다음과 같이 코드작성.
if(form) {
    form.addEventListener("submit", handleSubmit);
}
