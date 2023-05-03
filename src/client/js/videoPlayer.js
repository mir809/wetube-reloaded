const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

const handlePlayBtn = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handlePause = () => (playBtn.innerText = "Play");
const handlePlay = () => (playBtn.innerText = "Pause");

const handleMute = (e) => {};

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);

video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
