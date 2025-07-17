// Game variables
const star = document.querySelector('.star');
const scoreBoard = document.getElementById('score');
const levelDisplay = document.createElement('div');
levelDisplay.id = 'level';
document.body.appendChild(levelDisplay);
const timerDisplay = document.createElement('div');
timerDisplay.id = 'timer';
document.body.appendChild(timerDisplay);

let score = 0, level = 1, timeLeft = 60, timerInterval;
const audioClick = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3');
const bgMusic = new Audio('https://assets.mixkit.co/music/preview/mixkit-retro-arcade-game-loop-220.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

// UI buttons
const pauseBtn = document.createElement('button');
pauseBtn.textContent = '⏸️ Pause';
Object.assign(pauseBtn.style, {
  position: 'absolute', bottom: '20px', left: '20px',
  padding: '10px 20px', backgroundColor: '#ffcc00',
  border: 'none', borderRadius: '8px', fontWeight: 'bold'
});
document.body.appendChild(pauseBtn);

const leaderboardBtn = document.createElement('button');
leaderboardBtn.textContent = '🏅 Leaderboard';
Object.assign(leaderboardBtn.style, {
  position: 'absolute', bottom: '20px', right: '20px',
  padding: '10px 20px', backgroundColor: '#00e6e6',
  border: 'none', borderRadius: '8px', fontWeight: 'bold'
});
document.body.appendChild(leaderboardBtn);

// Functions
function moveStar() {
  const maxX = window.innerWidth - 50, maxY = window.innerHeight - 50;
  const x = Math.random() * maxX, y = Math.random() * maxY;
  const size = Math.random() * 30 + 30;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
}
function createParticles(x, y) {
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    document.body.appendChild(p);
    const angle = Math.random() * 2 * Math.PI;
    const dist = Math.random() * 100;
    const dx = x + dist * Math.cos(angle), dy = y + dist * Math.sin(angle);
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${dx - x}px, ${dy - y}px)`, opacity: 0 }], {
      duration: 600, easing: 'ease-out'
    });
    setTimeout(() => p.remove(), 600);
  }
}
function checkMilestone() {
  if (score === 5 || score === 10 || score === 20) {
    alert(`🎉 Milestone! ${score} stars!`);
    level++;
    levelDisplay.textContent = `Level: ${level}`;
  }
}
function updateTimer() {
  timerDisplay.textContent = `⏱️ Time: ${timeLeft}s`;
}
function saveScore() {
  const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  scores.push(score);
  scores.sort((a,b) => b - a);
  localStorage.setItem("leaderboard", JSON.stringify(scores.slice(0, 5)));
}
function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  let msg = "🏆 Top Scores:\n";
  scores.forEach((s, i) => msg += `${i+1}. ${s}\n`);
  alert(msg);
}
function showShareButton() {
  const btn = document.createElement("button");
  btn.textContent = "🔗 Share Score";
  Object.assign(btn.style, {
    position: "absolute", bottom: "70px", left: "50%",
    transform: "translateX(-50%)", padding: "10px 20px",
    backgroundColor: "#66ff99", border: "none", borderRadius: "8px",
    fontWeight: "bold"
  });
  document.body.appendChild(btn);
  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(`🎮 I caught ${score} stars in "Catch the Star"!`).then(() => {
      alert("✅ Score copied! Share it with friends!");
    });
  });
}
function endGame() {
  alert(`⏰ Time's up! Final Score: ${score}`);
  saveScore();
  star.style.display = 'none';
}
function startTimer() {
  clearInterval(timerInterval);
  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}
let paused = false;
pauseBtn.addEventListener("click", () => {
  paused = !paused;
  if (paused) {
    clearInterval(timerInterval);
    bgMusic.pause();
    pauseBtn.textContent = "▶️ Resume";
    star.style.display = "none";
  } else {
    startTimer();
    bgMusic.play();
    pauseBtn.textContent = "⏸️ Pause";
    star.style.display = "block";
  }
});
leaderboardBtn.addEventListener("click", showLeaderboard);

// Character select
const characterScreen = document.getElementById("character-screen");
const gameScreen = document.getElementById("game-screen");
document.querySelectorAll(".characters img").forEach(img => {
  img.addEventListener("click", () => {
    characterScreen.style.display = "none";
    gameScreen.style.display = "block";
    bgMusic.play();
    updateLevel();
    moveStar();
    startTimer();
    showShareButton();
  });
});
function updateLevel() {
  levelDisplay.textContent = `Level: ${level}`;
}
star.addEventListener("click", e => {
  score++;
  scoreBoard.textContent = `Score: ${score}`;
  audioClick.play();
  star.style.transform = 'scale(0.8)';
  setTimeout(() => star.style.transform = 'scale(1)', 200);
  createParticles(e.clientX, e.clientY);
  checkMilestone();
  moveStar();
});
