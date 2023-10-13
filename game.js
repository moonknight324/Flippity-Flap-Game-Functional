let screen;
let screenWidth = 1800;
let screenHeight = 900;
let context;

let tubeArray = [];
let tubeWidth = 128;
let tubeHeight = 624;
let tubeX = screenWidth;
let tubeY = 0;

let birdWidth = 54;
let birdHeight = 44;
let birdX = screenWidth / 8;
let birdY = screenHeight / 2;
let birdImg;

let toptubeImg;
let bottomtubeImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

let velocityX = -6;
let velocityY = 0;
let gravity = 0.4;

window.onload = function () {
  screen = document.getElementById("screen");
  screen.height = screenHeight;
  screen.width = screenWidth;
  context = screen.getContext("2d");

  birdImg = new Image();
  birdImg.src = "./assets/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  toptubeImg = new Image();
  toptubeImg.src = "./assets/toptube.png";

  bottomtubeImg = new Image();
  bottomtubeImg.src = "./assets/bottomtube.png";

  requestAnimationFrame(update);
  setInterval(placetubes, 2500);
  document.addEventListener("keydown", moveBird);
};

let score = 0;

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, screen.width, screen.height);

  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > screen.height) {
    gameOver = true;
    location.href = "./lose.html";
  }

  for (let i = 0; i < tubeArray.length; i++) {
    let tube = tubeArray[i];
    tube.x += velocityX;
    context.drawImage(tube.img, tube.x, tube.y, tube.width, tube.height);

    if (!tube.passed && bird.x > tube.x + tube.width) {
      score += 0.5;
      tube.passed = true;
      saveScoreToLocalStorage(score);
    }

    if (detectCollision(bird, tube)) {
      gameOver = true;
      location.href = "./lose.html";
    }
  }

  while (tubeArray.length > 0 && tubeArray[0].x < -tubeWidth) {
    tubeArray.shift();
  }
}

let gameOver = false;

function saveScoreToLocalStorage(score) {
  localStorage.setItem("flappybird_score", score);
}

function resetScore() {
  score = 0;
  saveScoreToLocalStorage(score);
}

function placetubes() {
  if (gameOver) {
    return;
  }

  let randomtubeY = tubeY - tubeHeight / 4 - Math.random() * (tubeHeight / 2);
  let openingSpace = screen.height / 4;

  let toptube = {
    img: toptubeImg,
    x: tubeX,
    y: randomtubeY,
    width: tubeWidth,
    height: tubeHeight,
    passed: false,
  };
  tubeArray.push(toptube);

  let bottomtube = {
    img: bottomtubeImg,
    x: tubeX,
    y: randomtubeY + tubeHeight + openingSpace,
    width: tubeWidth,
    height: tubeHeight,
    passed: false,
  };
  tubeArray.push(bottomtube);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    velocityY = -6;
  }
}

let seconds = 120;

function redirectToWinPage() {
  location.href = "./win.html";
}

function updateTimer() {
  const countdownElement = document.getElementById("timer");
  countdownElement.textContent = seconds;

  if (seconds <= 0) {
    clearInterval(timerInterval);
    countdownElement.textContent = "Time's up!";
    redirectToWinPage();
  } else {
    seconds--;
  }
}
const timerInterval = setInterval(updateTimer, 1000);