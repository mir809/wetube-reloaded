const record_Btn = document.getElementById("startBtn");
const video = document.getElementById("preview");
const download_Btn = document.getElementById("download");

let stream; // 컴퓨터 카메라로 촬영 (실시간으로 보기만)
let recorder; // 녹화 시작
let videoFile; // 녹화된 파일

const download = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecoding.webm";
  //링크 클릭시 주소이동이 아닌, 다운로드
  document.body.appendChild(a);
  //링크를 클릭하기위해 실제 html body에 추가
  a.click(); // html a태그(링크)를 사용자가 직접누른것과 똑같이 동작
};

const record_Stop = () => {
  record_Btn.innerText = "다시 녹화하기";
  record_Btn.removeEventListener("click", record_Stop);
  record_Btn.addEventListener("click", record_Start);

  recorder.stop(); // 녹화 종료
};

const record_Start = () => {
  record_Btn.innerText = "녹화 종료";
  record_Btn.removeEventListener("click", record_Start);
  record_Btn.addEventListener("click", record_Stop);

  recorder = new MediaRecorder(stream);
  //stream(미리 보기)중인 화면을 촬영

  recorder.ondataavailable = (event) => {
    //녹화 종료시 자동 발생되는 이벤트
    videoFile = URL.createObjectURL(event.data);
    // 녹화된 데이터를 웹사이트가 아닌 브라우저의 메모리에 할당
    //(실제 인터넷 주소가아닌 브라우저상에 존재하는 파일을 가리킴)
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };

  recorder.start(); //실제 녹화 시작
  video.srcObject = stream;
  video.play();
  // 녹화 재시작지 현재 카메라에 보이는 모습 표시
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
    //{ width: 500, height: 300 } - 촬영크기 설정 가능
  });
  video.srcObject = stream;
  video.play();
  // 페이지 들어오자 마자 영상 촬영 미리보기 시작
};

init();

record_Btn.addEventListener("click", record_Start);

download_Btn.addEventListener("click", download);
