const record_Btn = document.getElementById("startBtn");
const video = document.getElementById("preview");
const download_Btn = document.getElementById("download");

let stream;
let recorder;

const download = () => {};

const record_Stop = () => {
  record_Btn.innerText = "Restart Recording";
  record_Btn.removeEventListener("click", record_Stop);
  record_Btn.addEventListener("click", record_Start);

  recorder.stop(); // 녹화 종료
};

const record_Start = () => {
  record_Btn.innerText = "Stop Recording";
  record_Btn.removeEventListener("click", record_Start);
  record_Btn.addEventListener("click", record_Stop);

  recorder = new MediaRecorder(stream);
  //stream(미리 보기)중인 화면을 촬영

  recorder.ondataavailable = (event) => {
    //녹화 종료시 자동 발생되는 이벤트
    const videoFile = URL.createObjectURL(event.data);
    // 녹화된 데이터를 웹사이트가 아닌 브라우저의 메모리에 할당
    //(실제 인터넷 주소가아닌 브라우저상에 존재하는 파일을 가리킴)
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };

  recorder.start(); //실제 촬영 시작
  video.srcObject = stream;
  video.play();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
    //{ width: 500, height: 300 } - 촬영크기 설정 가능
  });
  video.srcObject = stream;
  video.play();
  // 페이지 들어오자 마자 영상 촬영 미리보기 켜짐
};

init();

record_Btn.addEventListener("click", record_Start);

download_Btn.addEventListener("click", download);
