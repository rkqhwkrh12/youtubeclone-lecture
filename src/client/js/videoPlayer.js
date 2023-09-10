const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

let volumeValue = 0.5;
video.volume = volumeValue;

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

const handlePlayClick = (e) => {
    //video가 정지되어 있을 때는 play버튼이 재생중일때는 pause버튼이
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "play" : "Pause";
};


const handleMuteClick = (e) => {
    if (video.muted) {
      video.muted = false;
    } else {
      video.muted = true;
    }
    //음소거 되어있으면 unmute로 해체할 수 있는 버튼이 나오게
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
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

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange); //input >> 비디오의 재생위치에 해당하는 값을 계속 알려줌
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate); //timeupdate >> 비디오의 시간이 변경되는 것을 감지함
timeline.addEventListener("input", handleTimelineChange);