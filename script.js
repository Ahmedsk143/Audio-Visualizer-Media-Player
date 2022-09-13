// At the start
fetchAudios();
let audios = JSON.parse(localStorage.getItem("audios"));
let selectedAudio = 0;
// Fetch at start function
function fetchAudios() {
  const fetchedAudios = [
    {
      title: "رحمن يا رحمن",
      src: "Mashary.mp3",
    },
    { title: "ربنا رب القلوب", src: "god of hearts.mp3" },
    { title: "طلع البدر علينا", src: "Albdr.mp3" },
  ];
  localStorage.setItem("audios", JSON.stringify(fetchedAudios));
}

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

loadAudio(0);
let autoPlay = true;
const audioCtx = new AudioContext();
let analyser = audioCtx.createAnalyser();
const gainNode = audioCtx.createGain();
let audioSource = audioCtx.createMediaElementSource(audio);
audioSource.connect(analyser).connect(audioCtx.destination);
audioSource.connect(gainNode).connect(audioCtx.destination);
let fftSizeactor = 2048;
analyser.fftSize = fftSizeactor;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
if (audioCtx.state === "suspended") {
  audioCtx.resume();
}

// The actuall drawing
// canvas.clientWidth / bufferLength
let barWidthFactor = 15;
const barWidth = barWidthFactor;
let barHeight;
let x; // it represents the x-offset, used to create bars next to each other

function animate() {
  x = 0;
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  analyser.getByteFrequencyData(dataArray);
  drawVisualizer(barHeight, barWidth, bufferLength, dataArray);
  requestAnimationFrame(animate);
}
function drawVisualizer(barHeight, barWidth, bufferLength, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 1.5;
    ctx.save();
    ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);
    ctx.rotate(i + Math.PI * 2);
    const hue = 200 + i * 0.1;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    // ctx.fillStyle = `#0c0d14`;
    // ctx.fillRect(0, 0, barWidth, barHeight);
    ctx.beginPath();
    ctx.arc(70, barHeight / 10, barHeight / 2, 0, Math.PI / 2);
    ctx.fill();
    // ctx.stroke();
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
  fftSizeactor = Math.floor(Math.random() * 20);
  fftSizeactor += 32;
}

// Sidenav accordion
const accordTriggers = document.querySelectorAll(".accord .accord-trigger");
accordTriggers.forEach((accord) => {
  accord.addEventListener("click", () => {
    accord.parentElement.classList.toggle("active");
  });
});
