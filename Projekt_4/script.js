// Create the canvas
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
document.body.appendChild(canvas);

// Set up the paddles
const paddleWidth = 10;
let paddleHeight = 200;
let paddleSpeed = 5;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

// Set up the ball
let ballSize = 10;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 3;
let ballSpeedY = 3;

// Set up the score
let leftPlayerScore = 0;
let rightPlayerScore = 0;

// Set up powerups
const powerupSize = 20;
const powerupSpeed = 2;
let powerups = [];
let powerupCooldown = 0;

// Update function
function update() {
  // Move the paddles
  if (keyIsDown("w") && leftPaddleY > 0) {
    leftPaddleY -= paddleSpeed;
  }
  if (keyIsDown("s") && leftPaddleY < canvas.height - paddleHeight) {
    leftPaddleY += paddleSpeed;
  }
  if (keyIsDown("ArrowUp") && rightPaddleY > 0) {
    rightPaddleY -= paddleSpeed;
  }
  if (keyIsDown("ArrowDown") && rightPaddleY < canvas.height - paddleHeight) {
    rightPaddleY += paddleSpeed;
  }

  // Move the ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Move the powerups
  for (let i = powerups.length - 1; i >= 0; i--) {
    const powerup = powerups[i];
    powerup.x -= powerupSpeed;

    // Check collision with paddles
    if (
      powerup.x <= paddleWidth &&
      powerup.y + powerupSize >= leftPaddleY &&
      powerup.y <= leftPaddleY + paddleHeight
    ) {
      // Apply powerup effect to the left paddle
      paddleHeight -= 100;
      powerups.splice(i, 1);
    } else if (
      powerup.x + powerupSize >= canvas.width - paddleWidth &&
      powerup.y + powerupSize >= rightPaddleY &&
      powerup.y <= rightPaddleY + paddleHeight
    ) {
      // Apply powerup effect to the right paddle
      paddleHeight -= 100;
      powerups.splice(i, 1);
    }

    // Remove powerup if it goes out of bounds
    if (powerup.x + powerupSize < 0 || powerup.x > canvas.width) {
      powerups.splice(i, 1);
    }
  }

  // Check collision with paddles
  if (
    ballX <= paddleWidth &&
    ballY + ballSize >= leftPaddleY &&
    ballY <= leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  } else if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY + ballSize >= rightPaddleY &&
    ballY <= rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Check collision with walls
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Check if ball went out of bounds
  if (ballX <= 0) {
    // Right player scores a point
    rightPlayerScore++;
    resetBall();
  } else if (ballX + ballSize >= canvas.width) {
    // Left player scores a point
    leftPlayerScore++;
    resetBall();
  }

  // Spawn new powerups randomly
  if (powerupCooldown <= 0 && powerups.length < 1) {
    const randomY = Math.random() * (canvas.height - powerupSize);
    const direction = Math.random() < 0.5 ? -1 : 1;
    const powerup = {
      x: direction === -1 ? canvas.width - powerupSize : 0,
      y: randomY,
      direction: direction,
    };
    powerups.push(powerup);
    powerupCooldown = Math.random() * (20000 - 5000) + 5000; 
  } else {
    powerupCooldown -= 16.7; 
  }

  // Reset paddle height after powerup effect expires
  if (paddleHeight < 200) {
    paddleHeight += 0.1; 
  }

  // Draw the paddles, ball, powerups, score, and background
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fff";
  context.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  context.fillRect(
    canvas.width - paddleWidth,
    rightPaddleY,
    paddleWidth,
    paddleHeight
  );
  context.fillRect(ballX, ballY, ballSize, ballSize);
  context.fillStyle = "red";
  powerups.forEach((powerup) => {
    context.fillRect(powerup.x, powerup.y, powerupSize, powerupSize);
  });

  // Draw the score
  context.font = "80px Arial";
  context.fillStyle = "#fff";
  context.fillText(` ${leftPlayerScore}`, 100, 100, );
  context.fillText(` ${rightPlayerScore}`, canvas.width - 170, 100);

  requestAnimationFrame(update);
}


function keyIsDown(key) {
  return keyState[key] === true;
}

function resetBall() {
  // Reset ball position and speed
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = -ballSpeedY;
}

// Track key state
const keyState = {};
window.addEventListener("keydown", (event) => {
  keyState[event.key] = true;
});
window.addEventListener("keyup", (event) => {
  keyState[event.key] = false;
});

function startGame() {
const paddleHeightRadios = document.getElementsByName("paddleHeight");
const ballSpeedRadios = document.getElementsByName("ballSpeed");

// Set the selected paddleHeight value
for (let i = 0; i < paddleHeightRadios.length; i++) {
  if (paddleHeightRadios[i].checked) {
    paddleHeight = parseInt(paddleHeightRadios[i].value);
    break;
  }
}

// Set the selected ballSpeed value
for (let i = 0; i < ballSpeedRadios.length; i++) {
  if (ballSpeedRadios[i].checked) {
    const selectedBallSpeed = parseInt(ballSpeedRadios[i].value);
    ballSpeedX = selectedBallSpeed;
    ballSpeedY = selectedBallSpeed;
    break;
  }
}

// Remove the menu from the DOM
const menuContainer = document.querySelector(".menu-container");
menuContainer.parentNode.removeChild(menuContainer);
}
const startButton = document.querySelector(".start-button");
startButton.addEventListener("click", startGame, update());