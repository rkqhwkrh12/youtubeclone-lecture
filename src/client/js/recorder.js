import { async } from "regenerator-runtime"; //프론트엔드에서 async await를 쓰기 위해서 import해줌.
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");


let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};
//파일 다운로드를 위한 함수 
//지정된 URL에서 파일을 다운로드하고 해당 파일을 지정된 이름으로 저장하는 역할.
const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a"); //html에 a태그 생성 >> URL을 나타내기 위한거
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};

//녹화된 비디오를 변환하고 다운로드하는 함수.
const handleDownload =  async () => {
    //actionBtn이 클릭됐을 때 한 번 더 실행되지 않게 하기 위해 eventListener를 지움.
    actionBtn.removeEventListener("click", handleDownload);
    //사용자에게 작업중임을 알리기 위한 코드
    actionBtn.innerText = "Transcoding...";

    actionBtn.disabled = true;
    //FFmpeg >> video 파일 변환을 위해 사용하는 라이브러리
    const ffmpeg = createFFmpeg({log:true}); //FFmpeg 작업로그를 기록.
    await ffmpeg.load(); //FFmpeg 로드후 초기화
    //FFmpeg에서 사용할 입력 파일 설정.
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
    //-i 로는 입력 파일을 , -r 로는 출력 비디오의 프레임 속도를 지정
    //files.output은 출력 파일의 이름을 나타냄.
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);
    //FFmpeg를 사용하여 원본 녹화 파일에서 썸네일 이미지를 추출함
    await ffmpeg.run(
        "-i",
        files.input,
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.thumb
    );
    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);
    //변환된 추출파일들을 Blob으로 변환하고,
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

    //다운로드할 수 있는 URL로 변환.
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);
    //downloadFile 함수를 사용하여 변환된 비디오 파일과 썸네일 파일을 다운로드함.
    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbUrl, "MyThumbnail.jpg");
    
    //ffmpeg가 끝나면 해당 링크가 사라지게 코드를 작성 >> 계속있으면 너무 헤비하다.
    //FFmpeg가 사용한 파일들을 삭제하여 리소스를 해제한다.
    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);
    //URL객체를 사용하여 생성된 URL을 해제함.
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);
    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again";
    actionBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
    actionBtn.innerText = "Recording"; //startBtn이 클릭되면 stop Recording으로 text가 바뀌고
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart); //해당 이벤트를 지워주고 다시 그 버튼이 클릭되면 handleStop이 되도록.
    recorder = new MediaRecorder(stream, {mimeType: "video/webm"}); //요걸로 녹화할 수 있음.
    recorder.ondataavailable = (event) => {
        //web브라우저에서만 사용할 수 있는 URL을 생성한다. >> 비디오 다운을 위해서 
        videoFile = URL.createObjectURL(event.data);
        video.srcObject=null;
        video.src = videoFile; //video를 화면에 보여주기 위해 꼭 필요한 경로설정임.
        video.loop = true;
        video.play();
        actionBtn.innerText = "Download";
        actionBtn.disabled = false;
        actionBtn.addEventListener("click", handleDownload);
    };
    recorder.start();
    //녹화시작 후 5초 정도만 녹화가 가능하게 설정하는 코드
    setTimeout(() => {
        recorder.stop();
      }, 5000);
};

const init = async() => {
    
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width:1024,
            height: 576,
        },
    });
    //video의 srcObject 속성에 다가 유저가 녹화한 영상이 저장되게 하기 위한 코드.
    video.srcObject = stream;
    video.play();
   
};

init();

//startBtn이 클릭되면 비디오 녹화가 시작되게 코드를 작성.
actionBtn.addEventListener("click", handleStart);