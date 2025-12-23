

// ===================== СНЕЖИНКИ =====================
function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');
  snowflake.textContent = '❄';
  snowflake.style.left = Math.random() * 100 + 'vw';
  snowflake.style.fontSize = Math.random() * 20 + 10 + 'px';
  snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
  document.body.appendChild(snowflake);
  setTimeout(() => snowflake.remove(), 10000);
}
setInterval(createSnowflake, 300);

// ===================== ВКЛАДКИ =====================
const buttons = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".tab-content");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});



// ===================== ПЛЕЙЛИСТ =====================
const tracks = [
  "music/audionautix-carol-of-the-bells.mp3",
  "music/ikson-first-snow.mp3",
  "music/jingle-punks-deck-the-halls-instrumental.mp3"
];

let trackIndex = 0;
const player = document.getElementById("player");
const titleElement = document.getElementById("track-title");

const titles = [
  "Carol of the Bells",
  "First Snow",
  "Deck the Halls"
];

function changeTrack(index) {
  trackIndex = index;
  player.src = tracks[trackIndex];
  titleElement.textContent = "🎧 " + titles[trackIndex];
  player.play().catch(() => console.log("⏸ Автоплей заблокирован"));
}

function nextTrack() {
  trackIndex = (trackIndex + 1) % tracks.length;
  changeTrack(trackIndex);
}

function prevTrack() {
  trackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
  changeTrack(trackIndex);
}

player.addEventListener("ended", nextTrack);

window.addEventListener("load", () => {
  player.src = tracks[trackIndex];
});

// ===================== СВЁРТЫВАЕМЫЙ ПЛЕЕР =====================
let isCollapsed = false;

function togglePlayer() {
  const body = document.getElementById("player-body");
  const btn = document.querySelector(".toggle-btn");
  isCollapsed = !isCollapsed;
  if (isCollapsed) {
    body.classList.add("collapsed");
    btn.textContent = "⏶";
  } else {
    body.classList.remove("collapsed");
    btn.textContent = "⏷";
  }
}





