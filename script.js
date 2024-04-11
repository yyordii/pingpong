class GameObject {
    constructor(x, y, width, height, speed, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.color = color;
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
      this.y -= this.speed;
    }
  
    moveDown() {
      this.y += this.speed;
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
    constructor(x, y, radius, speedX, speedY, color) {
      super(x, y, radius * 2, radius * 2, Math.hypot(speedX, speedY), color);
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
      if (
        this.y + this.radius > window.innerHeight ||
        this.y - this.radius < 0
      ) {
        this.speedY = -this.speedY;
      }
    }
  
    bounceOffObject(obj) {
      if (
        this.x + this.radius > obj.x &&
        this.x - this.radius < obj.x + obj.width &&
        this.y + this.radius > obj.y &&
        this.y - this.radius < obj.y + obj.height
      ) {
        this.speedX = -this.speedX;
      }
    }
  
    resetIfHitsWall() {
      if (this.x + this.radius > window.innerWidth) {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        return "black";
      }
      if (this.x - this.radius < 0) {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        return "red";
      }
      return false;
    }
  }
  
  class Game {
    constructor() {
      this.obj1 = new GameObject(
        window.innerWidth / 2 - 75,
        window.innerHeight / 2 - 25,
        50,
        50,
        5,
        "black"
      );
      this.obj2 = new GameObject(
        window.innerWidth / 2 + 25,
        window.innerHeight / 2 - 25,
        50,
        50,
        5,
        "red"
      );
      this.ball = new Ball(
        window.innerWidth / 2,
        window.innerHeight / 2,
        10,
        2,
        2,
        "blue"
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
  
    update() {
      // Move the objects
      if (this.keys["w"]) {
        this.obj1.moveUp();
      }
      if (this.keys["a"]) {
        this.obj1.moveLeft();
      }
      if (this.keys["s"]) {
        this.obj1.moveDown();
      }
      if (this.keys["d"]) {
        this.obj1.moveRight();
      }
  
      if (this.keys["ArrowUp"]) {
        this.obj2.moveUp();
      }
      if (this.keys["ArrowLeft"]) {
        this.obj2.moveLeft();
      }
      if (this.keys["ArrowDown"]) {
        this.obj2.moveDown();
      }
      if (this.keys["ArrowRight"]) {
        this.obj2.moveRight();
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
      }
    }
  
    gameLoop() {
      this.update();
      this.draw();
  
      // Request the next animation frame
      window.requestAnimationFrame(this.gameLoop.bind(this));
    }
  
    start() {
      var canvas = document.getElementById("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.gameLoop();
  
      // Event listeners for key presses
      window.addEventListener("keydown", (event) => {
        this.keys[event.key] = true;
  
        if (event.key === " ") {
          this.gamePaused = false;
        }
  
        // Prevent default behavior of arrow keys
        if (
          ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(
            event.key
          )
        ) {
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