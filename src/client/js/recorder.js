const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");

const record_Btn = document.getElementById("startBtn");
const video = document.getElementById("preview");
const download_Btn = document.getElementById("download");

let stream; // 컴퓨터 카메라로 촬영 (실시간으로 보기만)
let recorder; // 녹화 시작
let videoFile; // 녹화된 파일
let recordTimeout;

download_Btn.disabled = true;
// 다운로드 버튼 비활성화 된 상태로 시작
// (촬영한 영상 없는 상태에서 다운로드시 에러 방지)

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileURL, fileName) => {
  /* 다운로드 */
  const a = document.createElement("a");
  a.href = fileURL;
  a.download = fileName;
  //링크 클릭시 주소이동이 아닌, 다운로드
  document.body.appendChild(a);
  //링크를 클릭하기위해 실제 html body에 추가
  a.click(); // html a태그(링크)를 사용자가 직접누른것과 똑같이 동작
};

const download = async () => {
  download_Btn.removeEventListener("click", download);
  /* 다운로드 진행중에는 버튼을 다시 클릭해도 
  이벤트가 발생하지 않도록 변경*/
  download_Btn.innerText = "파일 다운중...";
  download_Btn.disabled = true;
  //button을 비활성화 시킴

  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  // 특정 파일을 파일시스템(FS)상에서 존재하도록 만듦

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );
  // 파일시스템(FS)를 통해 만들어진 파일을 원하는 형식으로 바꿈

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  // 파일시스템에서 변형한 파일을 읽음

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  // 읽어낸 파일을 Blob으로 바꿔줌

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);
  // 파일들의 위치를 알수있는 URL을 생성

  downloadFile(mp4Url, "MyVideo.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");
  // 파일 다운로드 함수실행

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);
  // 파일시스템 상에 있는 파일들 삭제

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
  // 브라우저 메모리에 있는 URL들 삭제

  download_Btn.addEventListener("click", download);
  download_Btn.innerText = "다운로드";
  // 다운이 끝나면 글씨, 이벤트 원래대로,
  // !!(다시 녹화 하기 전에는 버튼 비활성화 유지)
};

const record_Stop = () => {
  record_Btn.innerText = "다시 녹화하기";
  record_Btn.removeEventListener("click", record_Stop);
  record_Btn.addEventListener("click", record_Start);

  recorder.stop(); // 녹화 종료

  download_Btn.disabled = false;
  download_Btn.addEventListener("click", download);
  // 녹화 종료 후 영상파일이 생겼을 때만 다운로드 버튼 활성화
  // + 버튼 클릭시 이벤트 발생
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
  // 녹화 재시작시 현재 카메라에 보이는 모습 표시
  recordTimeout = setTimeout(() => {
    record_Stop(); // 함수호출
  }, 5000); // 녹화 시작 후 최대 5초까지만 촬영 가능하도록 설정
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
