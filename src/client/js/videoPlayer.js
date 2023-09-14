const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");


let controlsTimeout = null;
let volumeValue = 0.5;
let controlsMovementTimeout = null;
video.volume = volumeValue;

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handlePlayClick = (e) => {
    //video가 정지되어 있을 때는 play버튼이 재생중일때는 pause버튼이
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};


const handleMuteClick = (e) => {
    if (video.muted) {
      video.muted = false;
    } else {
      video.muted = true;
    }
    //음소거 되어있으면 unmute로 해체할 수 있는 버튼이 나오게
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
  };
  
const handleVolumeChange = (event) => {
    const {
      target: { value },
    } = event;
    if (video.muted) {
      video.muted = false;
      muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
};
const handleLoadedMetadata = () => {
    //video.duration으로 가져온 비디오의 전체 시간을 알 수 있음
    totalTime.innerText =  formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
    
};
  
const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const {
      target: { value },
    } = event;
    video.currentTime = value;
};
const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if(fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

  //마우스 커서가 화면에서 3초동안 있다면 볼륨이랑 다른 콘트롤창들이 보이지 않게 설정.
const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout =  setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange); //input >> 비디오의 재생위치에 해당하는 값을 계속 알려줌
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate); //timeupdate >> 비디오의 시간이 변경되는 것을 감지함
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);

