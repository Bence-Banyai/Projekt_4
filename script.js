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
    powerupCooldown = Math.random() * (20000 - 5000) + 5000; // Random cooldown between 5 to 20 seconds
  } else {
    powerupCooldown -= 16.7; // Subtract the elapsed time (approx. 60 FPS)
  }

  // Reset paddle height after powerup effect expires
  if (paddleHeight < 200) {
    paddleHeight += 0.1; // Adjust the rate at which the paddle grows back to its original height
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
  context.font = "20px Arial";
  context.fillStyle = "#fff";
  context.fillText(`Player 1: ${leftPlayerScore}`, 20, 30);
  context.fillText(`Player 2: ${rightPlayerScore}`, canvas.width - 140, 30);

  // Call update again on the next frame
  requestAnimationFrame(update);
}

// Utility functions
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

// Main menu variables
let showMenu = true;
let selectedPaddleHeight = paddleHeight;
let selectedBallSpeed = ballSpeedX;

// Draw main menu
function drawMainMenu() {
  // Draw the background
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the title
  context.font = "40px Arial";
  context.fillStyle = "#fff";
  context.fillText("Pong Game", canvas.width / 2 - 100, canvas.height / 4);

  // Draw the paddleHeight input box
  context.font = "20px Arial";
  context.fillText(
    "Paddle Height:",
    canvas.width / 2 - 80,
    canvas.height / 2 - 40
  );
  context.fillText(
    `Selected: ${selectedPaddleHeight}`,
    canvas.width / 2 + 50,
    canvas.height / 2 - 40
  );
  context.fillText("Short (60)", canvas.width / 2 - 80, canvas.height / 2 - 10);
  context.fillText(
    "Medium (150)",
    canvas.width / 2 - 80,
    canvas.height / 2 + 20
  );
  context.fillText("Long (220)", canvas.width / 2 - 80, canvas.height / 2 + 50);

  // Draw the ballSpeed input box
  context.fillText(
    "Ball Speed:",
    canvas.width / 2 - 80,
    canvas.height / 2 + 100
  );
  context.fillText(
    `Selected: ${selectedBallSpeed}`,
    canvas.width / 2 + 50,
    canvas.height / 2 + 100
  );
  context.fillText("Slow (2)", canvas.width / 2 - 80, canvas.height / 2 + 130);
  context.fillText(
    "Normal (4)",
    canvas.width / 2 - 80,
    canvas.height / 2 + 160
  );
  context.fillText("Fast (7)", canvas.width / 2 - 80, canvas.height / 2 + 190);

  // Draw the start button
  context.fillStyle = "#00ff00";
  context.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 250, 100, 50);
  context.fillStyle = "#000";
  context.fillText("Start", canvas.width / 2 - 25, canvas.height / 2 + 280);
}

// Event listener for main menu
canvas.addEventListener("click", (event) => {
  if (showMenu) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the start button is clicked
    if (
      mouseX >= canvas.width / 2 - 50 &&
      mouseX <= canvas.width / 2 + 50 &&
      mouseY >= canvas.height / 2 + 250 &&
      mouseY <= canvas.height / 2 + 300
    ) {
      showMenu = false;
      paddleHeight = selectedPaddleHeight;
      ballSpeedX = selectedBallSpeed;
      ballSpeedY = selectedBallSpeed;
      update();
    }

    // Check if the paddleHeight options are clicked
    if (mouseX >= canvas.width / 2 - 80 && mouseX <= canvas.width / 2 + 160) {
      if (mouseY >= canvas.height / 2 - 30 && mouseY <= canvas.height / 2) {
        selectedPaddleHeight = 60;
      } else if (
        mouseY >= canvas.height / 2 &&
        mouseY <= canvas.height / 2 + 20
      ) {
        selectedPaddleHeight = 150;
      } else if (
        mouseY >= canvas.height / 2 + 30 &&
        mouseY <= canvas.height / 2 + 60
      ) {
        selectedPaddleHeight = 220;
      }
    }

    // Check if the ballSpeed options are clicked
    if (mouseX >= canvas.width / 2 - 80 && mouseX <= canvas.width / 2 + 160) {
      if (
        mouseY >= canvas.height / 2 + 100 &&
        mouseY <= canvas.height / 2 + 130
      ) {
        selectedBallSpeed = 2;
      } else if (
        mouseY >= canvas.height / 2 + 130 &&
        mouseY <= canvas.height / 2 + 160
      ) {
        selectedBallSpeed = 4;
      } else if (
        mouseY >= canvas.height / 2 + 160 &&
        mouseY <= canvas.height / 2 + 190
      ) {
        selectedBallSpeed = 7;
      }
    }
  }
});

// Initial draw of the main menu
drawMainMenu();
