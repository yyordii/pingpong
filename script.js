import { Fireworks } from 'fireworks-js';

class GameObject {
  constructor(x, y, width, height, speed, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
    this.frameCount = 0; 
  
  }

  aiFollow(ball) {
    // Only update the AI's position every 5 frames
    if (this.frameCount % 1 === 0) {
      // Move the paddle towards the current position of the ball
      if (ball.y < this.y) {
        this.moveUp();
      } else if (ball.y > this.y + this.height) {
        this.moveDown();
      }
    }
  
    this.frameCount++;
  }


  // Method to draw the game objects
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveUp() {
    if (this.y > 0) {
      this.y -= this.speed;
    }
  }

  moveDown() {
    if (this.y + this.height < window.innerHeight) {
      this.y += this.speed;
    }
  }

  keepWithinScreen() {
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > window.innerHeight) this.y = window.innerHeight - this.height;
  }
}



class Ball extends GameObject {
  constructor(x, y, radius, color) {
    super(x, y, radius * 2, radius * 2, 6, color);
    this.radius = radius;
    this.speedX = (Math.random() < 0.5 ? -1 : 1) * this.speed;
    this.speedY = (Math.random() < 0.5 ? -1 : 1) * this.speed;
    this.isVisible = true;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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
      this.y = window.innerHeight - this.radius;
    } else if (this.y - this.radius < 0) {
      this.speedY = Math.abs(this.speedY);
      this.y = this.radius;
    }
  }

  resetIfHitsWall() {
    if (this.x + this.radius > window.innerWidth) {
      this.resetBallDirection(false);
      return this.isVisible ? 'blue' : false;
    }
    if (this.x - this.radius < 0) {
      this.resetBallDirection(true);
      return this.isVisible ? 'red' : false;
    }
    return false;
  }

  resetBallDirection(towardsBlue) {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.speedX = (towardsBlue ? -1 : 1) * Math.abs(this.speed);
    this.speedY = (Math.random() < 0.5 ? -1 : 1) * this.speed;
  }

  bounceOffObject(obj) {
    if (
      this.x + this.radius > obj.x &&
      this.x - this.radius < obj.x + obj.width &&
      this.y + this.radius > obj.y &&
      this.y - this.radius < obj.y + obj.height
    ) {
      let hitPos = (this.y - obj.y) / obj.height;
      this.speedX = -this.speedX;
      this.speedY = 2 * (hitPos - 0.5) * this.speed;
    }
  }
}



class Game {
  constructor() {
    const blockParams = { width: 10, height: 130, speed: 5, offset: 100 };
    this.obj1 = new GameObject(blockParams.offset, (window.innerHeight - blockParams.height) / 2, blockParams.width, blockParams.height, blockParams.speed, 'blue');
    this.obj2 = new GameObject(window.innerWidth - blockParams.width - blockParams.offset, (window.innerHeight - blockParams.height) / 2, blockParams.width, blockParams.height, blockParams.speed, 'red');
    this.ball = new Ball(window.innerWidth / 2, window.innerHeight / 2, 10, 'white');
    this.keys = {};
    this.gamePaused = true;
    this.timerInterval = null;
    this.timer = 60;
    this.scoreBlue = 0;
    this.scoreRed = 0;
    this.mode = 'ai';
  }

  draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.obj1.draw(ctx);
    this.obj2.draw(ctx);
    if (this.timer > 0) this.ball.draw(ctx);
  }


  
  update() {
    if (this.keys['w']) this.obj1.moveUp();
    if (this.keys['s']) this.obj1.moveDown();
    if (this.mode === 'duo') {
      if (this.keys['ArrowUp']) this.obj2.moveUp();
      if (this.keys['ArrowDown']) this.obj2.moveDown();
    } else {
      // Only move the AI when the game is not paused
      if (!this.gamePaused) {
        this.obj2.aiFollow(this.ball);
      }
    }
    this.obj1.keepWithinScreen();
    this.obj2.keepWithinScreen();
    if (!this.gamePaused) {
      this.ball.move();
      this.ball.bounceOffWalls();
      this.ball.bounceOffObject(this.obj1);
      this.ball.bounceOffObject(this.obj2);
      const scorer = this.ball.resetIfHitsWall();
      if (scorer && this.timer > 0) {
        this.gamePaused = true;
        this.pauseTimer();
        if (scorer === 'blue') {
          this.scoreBlue++;
          document.getElementById('score-blue').textContent = this.scoreBlue;
        } else if (scorer === 'red') {
          this.scoreRed++;
          document.getElementById('score-red').textContent = this.scoreRed;
        }
        this.resetPositions();
      }
    }
  }

  gameLoop() {
    this.update();
    this.draw();
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  resetPositions() {
    const blockParams = { width: 10, height: 130, offset: 100 };
    this.obj1.x = blockParams.offset;
    this.obj1.y = (window.innerHeight - blockParams.height) / 2;
    this.obj2.x = window.innerWidth - blockParams.width - blockParams.offset;
    this.obj2.y = (window.innerHeight - blockParams.height) / 2;
    this.ball.resetBallDirection(true);
  }

  adjustCanvasSize() {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  start() {
    this.adjustCanvasSize();
    window.addEventListener('resize', this.adjustCanvasSize.bind(this));
    this.gameLoop();
    window.addEventListener('keydown', (event) => {
      this.keys[event.key] = true;
      if (event.key === ' ') {
        this.gamePaused = !this.gamePaused;
        if (this.gamePaused) {
          this.pauseTimer();
        } else {
          this.startTimer();
        }
      }
      if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.key)) {
        event.preventDefault();
      }
    });
    window.addEventListener('keyup', (event) => {
      this.keys[event.key] = false;
    });
  }

  showFireworks() {
    const container = document.getElementById('canvas');
    const fireworks = new Fireworks(container, {
      maxRockets: 50,
      rocketSpawnInterval: 150,
      numParticles: 100,
      explosionMinHeight: 20,
      explosionMaxHeight: 200,
      explosionChance: 0.08,
    });
    fireworks.start();
  }

  startTimer() {
    if (!this.timerInterval) {
      const timerElement = document.getElementById('timer');
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
          timerElement.textContent = this.timer;
          if (this.timer === 0) {
            clearInterval(this.timerInterval);
            const winnerElement = document.getElementById('winner');
            if (this.scoreBlue > this.scoreRed) {
              winnerElement.textContent = `The winner is blue`;
              winnerElement.style.color = 'blue';
            } else if (this.scoreBlue < this.scoreRed) {
              winnerElement.textContent = `The winner is red`;
              winnerElement.style.color = 'red';
            } else {
              winnerElement.textContent = `It's a draw`;
              winnerElement.style.color = 'black';
            }
            winnerElement.classList.add('animate-winner');
            this.showFireworks();
  
            // Refresh the page 10 seconds after the game ends
            setTimeout(function() {
              location.reload();
            }, 10000);
          }
        }
      }, 1000);
    }
  }

  pauseTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
}

// Start the game
new Game().start();
