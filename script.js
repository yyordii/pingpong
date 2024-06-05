class GameObject {
  constructor(x, y, width, height, speed, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
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

      return "black";
    }
    if (this.x - this.radius < 0) {
      this.x = window.innerWidth / 2;
      this.y = window.innerHeight / 2;

      // Randomize the ball's speed direction towards the red paddle
      this.speedX = Math.abs(this.speed);
      this.speedY = (Math.random() < 0.5 ? -1 : 1) * this.speed;

      return "red";
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
    this.scoreBlack = 0;
    this.scoreRed = 0;
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

      // Draw the ball
      this.ball.draw(ctx);
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
    if (this.keys["ArrowUp"]) {
      this.obj2.moveUp();
    }
    if (this.keys["ArrowDown"]) {
      this.obj2.moveDown();
    }

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
    if (scorer) {
      this.gamePaused = true;
      if (scorer === "black") {
        this.scoreBlack++;
        document.getElementById("score-black").textContent = this.scoreBlack;
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
        this.gamePaused = false;
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
}

// Start the game
new Game().start();
