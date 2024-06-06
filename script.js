import { Fireworks } from 'fireworks-js'

class GameObject {
  constructor(x, y, width, height, speed, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
  }

  aiFollow(ball) {
    // If the ball is above the paddle, move up
    if (ball.y < this.y) {
      this.moveUp();
    }
    // If the ball is below the paddle, move down
    else if (ball.y > this.y + this.height) {
      this.moveDown();
    }
  }

  bounceOffObject(obj) {
    if (
      this.x + this.radius > obj.x &&
      this.x - this.radius < obj.x + obj.width &&
      this.y + this.radius > obj.y &&
      this.y - this.radius < obj.y + obj.height
    ) {
      // Calculate the hit position as a percentage of the object's height
      let hitPos = (this.y - obj.y) / obj.height;

      // Change the direction based on the hit position
      this.speedX = -this.speedX;
      this.speedY = 2 * (hitPos - 0.5) * this.speed;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveUp() {
    if (this.y - this.speed >= 0) {
      this.y -= this.speed;
    }
  }

  moveDown() {
    if (this.y + this.height + this.speed <= window.innerHeight) {
      this.y += this.speed;
    }
  }

  keepWithinScreen() {
    if (this.x + this.width > window.innerWidth) {
      this.x = window.innerWidth - this.width;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y + this.height > window.innerHeight) {
      this.y = window.innerHeight - this.height;
    }
    if (this.y < 0) {
      this.y = 0;
    }
  }
}

class Ball extends GameObject {
  constructor(x, y, radius, color) {
    const speed = 6;
    const speedX = (Math.random() < 0.5 ? -1 : 1) * speed;
    const speedY = (Math.random() < 0.5 ? -1 : 1) * speed;
    super(x, y, radius * 2, radius * 2, speed, color);
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
    this.isVisible = true;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  bounceOffWalls() {
    if (this.y + this.radius > window.innerHeight) {
      this.speedY = -Math.abs(this.speedY);
      this.y = window.innerHeight - this.radius; // Prevent the ball from getting stuck in the wall
    } else if (this.y - this.radius < 0) {
      this.speedY = Math.abs(this.speedY);
      this.y = this.radius; // Prevent the ball from getting stuck in the wall
    }
  }

  resetIfHitsWall() {
    if (this.x + this.radius > window.innerWidth) {
      this.x = window.innerWidth / 2;
      this.y = window.innerHeight / 2;

      // Randomize the ball's speed direction towards the blue paddle
      this.speedX = -Math.abs(this.speed);
      this.speedY = (Math.random() < 0.5 ? -1 : 1) * this.speed;

      return this.isVisible ? "blue" : false; // Modify this line
    }
    if (this.x - this.radius < 0) {
      this.x = window.innerWidth / 2;
      this.y = window.innerHeight / 2;

      // Randomize the ball's speed direction towards the red paddle
      this.speedX = Math.abs(this.speed);
      this.speedY = (Math.random() < 0.5 ? -1 : 1) * this.speed;

      return this.isVisible ? "red" : false; // Modify this line
    }
    return false;
  }
}



class Game {
  constructor() {
    let blockWidth = 10;
    let blockHeight = 130;
    let blockSpeed = 5;
    let blockColor1 = "blue";
    let blockColor2 = "red";
    let blockOffset = 100;

    this.mode = 'ai';
    this.gamePaused = true;
    this.timerInterval = null;

    this.obj1 = new GameObject(
      blockOffset,
      window.innerHeight / 2 - blockHeight / 2,
      blockWidth,
      blockHeight,
      blockSpeed,
      blockColor1
    );
    this.obj2 = new GameObject(
      window.innerWidth - blockWidth - blockOffset,
      window.innerHeight / 2 - blockHeight / 2,
      blockWidth,
      blockHeight,
      blockSpeed,
      blockColor2
    );
    this.ball = new Ball(
      window.innerWidth / 2,
      window.innerHeight / 2,
      10,
      "white"
    );
    this.keys = {};
    this.gamePaused = true;
    this.scoreBlue = 0;
    this.scoreRed = 0;

    this.timer = 60;
  }

  draw() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");
  
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw the objects
      this.obj1.draw(ctx);
      this.obj2.draw(ctx);
  
      // Draw the ball only if the game is not over
      if (this.timer > 0) {
        this.ball.draw(ctx);
      }
    }
  }

  resetPositions() {
    let blockWidth = 10;
    let blockHeight = 130;
    let blockOffset = 100;

    this.obj1.x = blockOffset;
    this.obj1.y = window.innerHeight / 2 - blockHeight / 2;

    this.obj2.x = window.innerWidth - blockWidth - blockOffset;
    this.obj2.y = window.innerHeight / 2 - blockHeight / 2;

    // Reset ball position and randomize direction towards the blue paddle
    this.ball.x = window.innerWidth / 2;
    this.ball.y = window.innerHeight / 2;
    this.ball.speedX = -Math.abs(this.ball.speed);
    this.ball.speedY = (Math.random() < 0.5 ? -1 : 1) * this.ball.speed;
  }

  update() {
    // Move the objects
       if (this.keys["w"]) {
      this.obj1.moveUp();
    }
    if (this.keys["s"]) {
      this.obj1.moveDown();
    }

    // Check the mode
    if (this.mode === 'ai') {
      // AI follows the ball
      this.obj2.aiFollow(this.ball);
    } else if (this.mode === 'duo') {
      // Move the second object according to the arrow keys
      if (this.keys["ArrowUp"]) {
        this.obj2.moveUp();
      }
      if (this.keys["ArrowDown"]) {
        this.obj2.moveDown();
      }
    }

    // AI follows the ball
    this.obj2.aiFollow(this.ball);

    // Keep the objects within the screen
    this.obj1.keepWithinScreen();
    this.obj2.keepWithinScreen();

    // Move the ball
    if (!this.gamePaused) {
      this.ball.move();
    }

    // Bounce the ball off the top and bottom walls
    this.ball.bounceOffWalls();

    // Bounce the ball off the objects
    this.ball.bounceOffObject(this.obj1);
    this.ball.bounceOffObject(this.obj2);

    // Reset the ball if it hits the left or right wall
    let scorer = this.ball.resetIfHitsWall();
    if (scorer && this.timer > 0) { // Add condition to check if timer is greater than 0
      this.gamePaused = true;
      this.pauseTimer(); // Pause the timer when a goal is scored
      if (scorer === "blue") {
        this.scoreBlue++;
        document.getElementById("score-blue").textContent = this.scoreBlue;
      } else if (scorer === "red") {
        this.scoreRed++;
        document.getElementById("score-red").textContent = this.scoreRed;
      }
      this.resetPositions();
    }
  }


  gameLoop() {
    this.update();
    this.draw();

    // Request the next animation frame
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  adjustCanvasSize() {
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  start() {
    this.adjustCanvasSize();

    window.addEventListener("resize", () => {
      this.adjustCanvasSize();
    });

    this.gameLoop();

    // Event listeners for key presses
    window.addEventListener("keydown", (event) => {
      this.keys[event.key] = true;

      if (event.key === " ") {
        // Toggle the game's paused state
        this.gamePaused = !this.gamePaused;

        if (this.gamePaused) {
          this.pauseTimer(); // Pause the timer when the game is paused
        } else {
          this.startTimer(); // Start the timer when the game starts
        }
      }

      // Prevent default behavior of arrow keys
      if (["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.key)) {
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keys[event.key] = false;
    });
  }

  showFireworks() {
    let container = document.getElementById('canvas');
    let fireworks = new Fireworks(container, {
      maxRockets: 50,            // max # of rockets to spawn
      rocketSpawnInterval: 150, // millisends to check if new rockets should spawn
      numParticles: 100,        // number of particles to spawn when rocket explodes (+0-10)
      explosionMinHeight: 20,   // minimum height for random explode
      explosionMaxHeight: 200,  // maximum height for random explode
      explosionChance: 0.08     // chance in each tick the rocket will explode
    });
    fireworks.start();
  }

  startTimer() {
    // Only start the timer if it's not already running
    if (!this.timerInterval) {
      // Get the timer element
      const timerElement = document.getElementById("timer");

      // Decrease the timer by one every second
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) { // Add condition to check if timer is greater than 0
          this.timer--;

          // Update the timer element
          timerElement.textContent = this.timer;

          // When the timer reaches zero, stop the timer and show the winner
          if (this.timer === 0) {
            clearInterval(this.timerInterval);
            let winner = this.scoreBlue > this.scoreRed ? 'blue' : 'Red';
            let winnerElement = document.getElementById('winner');
            winnerElement.textContent = `The winner is ${winner}`;
            winnerElement.style.color = winner === 'blue' ? 'blue' : 'red';
            winnerElement.classList.add('animate-winner'); // Add the animation class
            this.showFireworks(); // Show fireworks when the game ends
          }
        }
      }, 1000);
    }
  }
  pauseTimer() {
    // Clear the interval to pause the timer
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
}

// Start the game
new Game().start();
