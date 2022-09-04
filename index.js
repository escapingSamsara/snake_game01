const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let HeadX = 10;
let HeadY = 10;
const snakeParts = [];
let tailLength = 2;

let AppleX = 5;
let AppleY = 5;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const swallowSound = new Audio("heavy_swallow.mp3");

//game loop
function drawGame() {
  // xVelocity = inputsXVelocity;
  // yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();
  if (score > 5) {
    speed = 8;
  }
  if (score > 10) {
    speed = 10;
  }
  if (score > 15) {
    speed = 14;
  }
  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;
  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }
  //walls
  if (HeadX < 0) {
    gameOver = true;
  }
  if (HeadX > 19) {
    gameOver = true;
  } else if (HeadY < 0) {
    gameOver = true;
  } else if (HeadY > 19) {
    gameOver = true;
  }
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === HeadX && part.y === HeadY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";

    // Fill with gradient
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", " magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    ctx.fillStyle = gradient;
    ctx.fillText("game over", canvas.width / 4, canvas.height / 2);
  } else if (HeadX === tileCount) {
    gameOver = true;
  } else if (HeadY < 0) {
    gameOver = true;
  } else if (HeadY === tileCount) {
    gameOver = true;
  }
  return gameOver;
}
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Verdana";
  ctx.fillText("score " + score, canvas.width - 70, 25);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//Snake funtions
function drawSnake() {
  ctx.fillStyle = "beige";
  ctx.fillRect(HeadX * tileCount, HeadY * tileCount, tileSize, tileSize);

  ctx.fillStyle = "grey";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }
  snakeParts.push(new SnakePart(HeadX, HeadY)); //put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // removes furthest item from the snake parts if we have more than our tailsize (inhibits endless growth)
  }
  ctx.fillStyle = "beige";
  ctx.fillRect(HeadX * tileCount, HeadY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  HeadX = HeadX + xVelocity;
  HeadY = HeadY + yVelocity;
}

//Apple funtions
function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(AppleX * tileCount, AppleY * tileCount, tileSize, tileSize);
}
function checkAppleCollision() {
  if (AppleX === HeadX && AppleY == HeadY) {
    AppleX = Math.floor(Math.random() * tileCount);
    AppleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    swallowSound.play();
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  //up
  if (event.keyCode == 38) {
    if (yVelocity == 1) return;
    yVelocity = -1;
    xVelocity = 0;
  }
  //down
  if (event.keyCode == 40) {
    if (yVelocity == -1) return;
    yVelocity = 1;
    xVelocity = 0;
  }
  //left
  if (event.keyCode == 37) {
    if (xVelocity == 1) return;
    yVelocity = 0;
    xVelocity = -1;
  }
  //right
  if (event.keyCode == 39) {
    if (xVelocity == -1) return;
    yVelocity = 0;
    xVelocity = 1;
  }
}
drawGame();
