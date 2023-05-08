const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

const recordStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
    //{ width: 500, height: 300 } - 촬영크기 설정 가능
  });
  video.srcObject = stream;
  video.play();
};

startBtn.addEventListener("click", recordStart);
