const file = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const visualizerContainer = document.querySelector(".visualizer");
const randomBtn = document.querySelector(".visualizer .random");
const repeat = document.getElementById("repeat");
const autoplay = document.getElementById("autoplay");
const prev = document.getElementById("prev");
const play = document.getElementById("play");
const playWrapper = document.querySelector(".player  .controls .play-wrapper ");
const pause = document.getElementById("pause");
const next = document.getElementById("next");
const volumeMuted = document.querySelector("#volume .mute");
const volumeNormal = document.querySelector("#volume .normal");
const audioName = document.querySelector(".player .info");
const progressWrapper = document.querySelector(".progress-wrapper");
const progressBar = document.querySelector("#progress");
const currentTimeEl = document.querySelector(".time-wrapper #current");
const durationEl = document.querySelector(".time-wrapper #duration");
const volumeControl = document.querySelector("#volume-range");
const tracks = document.querySelectorAll(".explored .audios .audio");

let audio = new Audio();
// Aduio controls event listeners
play.addEventListener("click", playAudio);
pause.addEventListener("click", pauseAudio);
next.addEventListener("click", playNext);
prev.addEventListener("click", playPrev);
repeat.addEventListener("click", enableRepeat);
autoplay.addEventListener("click", enableAutoplay);
volumeMuted.addEventListener("click", muteControl);
volumeNormal.addEventListener("click", muteControl);
randomBtn.addEventListener("click", randomEffect);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", afterEnding);
progressWrapper.addEventListener("click", changeProgress);
volumeControl.addEventListener("input", () => {
  gainNode.gain.value = volumeControl.value;
});
file.addEventListener("change", fileUploaded);
tracks.forEach((track) => {
  track.addEventListener("click", () => {
    selectedAudio = track.getAttribute("data-audio");
    loadAudio(selectedAudio);
    playAudio();
    menuTrigger.parentElement.classList.toggle("collapsed");
  });
});
window.addEventListener("load", setCanvasDimensions);
window.addEventListener("resize", setCanvasDimensions);

function setCanvasDimensions() {
  canvas.width = visualizerContainer.clientWidth;
  canvas.height = visualizerContainer.clientHeight;
}
let audios = [
  {
    title: " علي مقام الكرد - مشاري ",
    src: "track1.mp3",
  },
  { title: " ربنا رب القلوب - مشاري ", src: "track2.mp3" },
  { title: "أعمارنا اعمالنا - ماهر زين", src: "track3.mp3" },
  { title: "اذا المرء لم يرضى", src: "track4.mp3" },
  { title: "صلوا عليه شفيع الامة", src: "track5.mp3" },
];
let selectedAudio = 0;
loadAudio(0);
let autoPlay = true;
const audioCtx = new AudioContext();
let analyser = audioCtx.createAnalyser();
const gainNode = audioCtx.createGain();
let audioSource = audioCtx.createMediaElementSource(audio);
audioSource.connect(analyser).connect(audioCtx.destination);
audioSource.connect(gainNode).connect(audioCtx.destination);
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
if (audioCtx.state === "suspended") {
  audioCtx.resume();
}

// The actuall drawing
// canvas.width / bufferLength
let barWidth = 15;
let barHeight;
let x; // it represents the x-offset, used to create bars next to each other
const particles = new Image();
const center = new Image();

particles.src = "https://www.freeiconspng.com/uploads/snow-png-10.png";
center.src = "https://www.freeiconspng.com/uploads/blue-heart-icon-png-17.png";
let num = 1;
function animate() {
  x = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (num == 1) {
    drawVisualizer1(barHeight, barWidth, bufferLength, dataArray);
  } else if (num == 2) {
    barWidth = canvas.width / 2 / bufferLength;
    drawVisualizer2(barHeight, barWidth, bufferLength, dataArray);
  } else if (num == 3) {
    drawVisualizer3(barHeight, barWidth, bufferLength, dataArray);
  } else if (num == 4) {
    drawVisualizer4(barHeight, barWidth, bufferLength, dataArray);
  }
  analyser.getByteFrequencyData(dataArray);
  requestID = requestAnimationFrame(animate);
}
function drawVisualizer1(barHeight, barWidth, bufferLength, dataArray) {
  ctx.lineCap = "";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "";
  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] * (canvas.width + canvas.height)) / 2000;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(i * 4);
    ctx.drawImage(particles, 0, barHeight, barHeight / 2.5, barHeight / 2.5);
    x += barWidth;
    ctx.restore();
  }
  let size = dataArray[15] * 1.5 > 70 ? dataArray[15] : 70;
  ctx.drawImage(
    center,
    canvas.width / 2 - size / 2,
    canvas.height / 2 - size / 2,
    size,
    size
  );
}
function drawVisualizer2(barHeight, barWidth, bufferLength, dataArray) {
  ctx.lineCap = "";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "";
  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] * (canvas.width + canvas.height)) / 900;
    const hue = 5 + i * 2;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(
      canvas.width / 2 - x,
      canvas.height - barHeight,
      barWidth + 1,
      barHeight
    );
    x += barWidth;
  }
  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] * (canvas.width + canvas.height)) / 900;
    const hue = 5 + i * 2;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth + 1, barHeight);
    x += barWidth;
  }
}
function drawVisualizer3(barHeight, barWidth, bufferLength, dataArray) {
  ctx.lineCap = "square";
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 5;
  ctx.shadowColor = "black";
  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] * (canvas.width + canvas.height)) / 2000;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(i * 10);

    ctx.lineWidth = barHeight / 4;
    ctx.strokeStyle = "rgba(150,150,150,1)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, barHeight);
    ctx.stroke();

    ctx.lineWidth = barHeight / 5;
    ctx.strokeStyle = "rgba(150,150,150,1)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, barHeight);
    ctx.stroke();

    x += barWidth;
    ctx.restore();
  }
}
function drawVisualizer4(barHeight, barWidth, bufferLength, dataArray) {
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 0;
  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] * (canvas.width + canvas.height)) / 2000;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(i * bufferLength);
    const hue = i * 2;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(0, barHeight, barHeight / 10, 0, Math.PI * 2);
    ctx.arc(0, barHeight / 1.5, barHeight / 10, 0, Math.PI * 2);
    ctx.arc(0, barHeight / 2, barHeight / 60, 0, Math.PI * 2);
    ctx.arc(0, barHeight / 3, barHeight / 80, 0, Math.PI * 2);
    ctx.fill();
    x += barWidth;
    ctx.restore();
  }
}

animate();

// Controls' functions
function loadAudio(audioIndex) {
  audio.currentTime = 0;
  audio.src = audios[audioIndex].src;
  audioName.textContent = audios[audioIndex].title;
  tracks.forEach((track) => {
    if (selectedAudio == track.getAttribute("data-audio")) {
      track.classList.add("active");
    } else {
      track.classList.remove("active");
    }
  });
}

function playAudio() {
  playWrapper.classList.add("playing");
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  audio.play();
}
function fileUploaded() {
  playWrapper.classList.add("playing");
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  const files = this.files;
  const file = files[0];
  audio.src = URL.createObjectURL(file);
  audioName.textContent = file.name.substring(0, file.name.indexOf("."));
  audio.load();
  audio.play();
}
function playNext() {
  if (selectedAudio == audios.length - 1) {
    selectedAudio = 0;
  } else {
    selectedAudio++;
  }
  loadAudio(selectedAudio);
  playAudio();
}
function playPrev() {
  if (selectedAudio == 0) {
    selectedAudio = audios.length - 1;
  } else {
    selectedAudio--;
  }
  audio.currentTime = 0;
  loadAudio(selectedAudio);
  playAudio();
}
function pauseAudio() {
  playWrapper.classList.remove("playing");
  audio.pause();
}

function enableRepeat(e) {
  audio.loop = !audio.loop;
  if (audio.loop) {
    e.target.parentElement.classList.add("active");
  } else {
    e.target.parentElement.classList.remove("active");
  }
}
function enableAutoplay(e) {
  autoPlay = !autoPlay;
  if (autoPlay) {
    this.classList.add("active");
  } else {
    this.classList.remove("active");
  }
}
function afterEnding() {
  if (autoPlay) {
    playNext();
  } else {
    pauseAudio();
  }
}
function muteControl(e) {
  console.log(e.target.parentElement);
  if (e.target.classList.value.includes("normal")) {
    gainNode.gain.value = -1;
    volumeControl.value = -1;
    e.target.parentElement.classList.add("active");
  } else {
    e.target.parentElement.classList.remove("active");
    gainNode.gain.value = 1;
    volumeControl.value = 1;
  }
  // audio.muted = !audio.muted;
  // if (audio.muted) {
  //   e.target.parentElement.classList.add("active");
  // } else {
  //   e.target.parentElement.classList.remove("active");
  // }
}

function updateProgress(e) {
  const { currentTime, duration } = e.target;
  progressBar.style.width = `${(currentTime / duration) * 100}%`;
  let currentMints = Math.floor(currentTime / 60);
  let currentSecs = Math.floor(currentTime % 60);
  let totalMints = Math.floor(duration / 60);
  let totalSecs = Math.floor(duration % 60);
  if (currentSecs < 10) {
    currentSecs = `0${currentSecs}`;
  }
  if (totalSecs < 10) {
    totalSecs = `0${totalSecs}`;
  }
  if (totalSecs) {
    durationEl.textContent = `${totalMints}: ${totalSecs}`;
  }
  currentTimeEl.textContent = `${currentMints}:${currentSecs}`;
}
function changeProgress(e) {
  const containerWidth = this.clientWidth;
  const jumpTo = e.offsetX;
  const ratio = jumpTo / containerWidth;
  audio.currentTime = ratio * audio.duration;
}
function randomEffect() {
  randomBtn.classList.add("active");
  setTimeout(() => {
    randomBtn.classList.remove("active");
  }, 1000);
  if (num < 4) {
    num++;
  } else {
    num = 1;
  }
}

// Sidenav accordion
const accordTriggers = document.querySelectorAll(".accord .accord-trigger");
accordTriggers.forEach((accord) => {
  accord.addEventListener("click", () => {
    accord.parentElement.classList.toggle("active");
  });
});

// menu toggle
const menuTrigger = document.getElementById("menu-toggle");
menuTrigger.addEventListener("click", () => {
  menuTrigger.parentElement.classList.toggle("collapsed");
});
