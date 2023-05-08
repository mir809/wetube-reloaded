const record_Btn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;

const record_Stop = () => {
  record_Btn.innerText = "Start Recording";
  record_Btn.removeEventListener("click", record_Stop);
  record_Btn.addEventListener("click", record_Start);
};

const record_Start = () => {
  record_Btn.innerText = "Stop Recording";
  record_Btn.removeEventListener("click", record_Start);
  record_Btn.addEventListener("click", record_Stop);

  const recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (event) => {
    //녹화 종료시 자동 발생되는 이벤트
    console.log("recording done");
    console.log(event);
    console.log(event.data); // 녹화된 데이터
  };

  console.log(recorder); // 시작 전 - 비활성화 상태
  recorder.start(); //실제 촬영 시작
  console.log(recorder); // 시작 후 - 녹화중 상태

  setTimeout(() => {
    recorder.stop();
  }, 5000); // 5초후 자동으로 촬영 종료
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
