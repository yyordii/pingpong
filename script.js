

      var obj1 = {
        x: window.innerWidth / 2 - 75,
        y: window.innerHeight / 2 - 25,
        width: 50,
        height: 50,
        speed: 5,
        color: "black",
      };

      var obj2 = {
        x: window.innerWidth / 2 + 25,
        y: window.innerHeight / 2 - 25,
        width: 50,
        height: 50,
        speed: 5,
        color: "red",
      };

      var ball = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        radius: 10,
        speedX: 2,
        speedY: 2,
        color: "blue",
      };

      var keys = {};
      var gamePaused = true;
      var scoreBlack = 0;
      var scoreRed = 0;

 
      function draw() {
        var canvas = document.getElementById("canvas");
        if (canvas.getContext) {
          var ctx = canvas.getContext("2d");

          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the objects
          ctx.fillStyle = obj1.color;
          ctx.fillRect(obj1.x, obj1.y, obj1.width, obj1.height);
          ctx.fillStyle = obj2.color;
          ctx.fillRect(obj2.x, obj2.y, obj2.width, obj2.height);

          // Draw the ball
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
          ctx.fillStyle = ball.color;
          ctx.fill();
        }
      }
      function update() {
        // Move the objects
        if (keys["w"]) {
          obj1.y -= obj1.speed;
        }
        if (keys["a"]) {
          obj1.x -= obj1.speed;
        }
        if (keys["s"]) {
          obj1.y += obj1.speed;
        }
        if (keys["d"]) {
          obj1.x += obj1.speed;
        }

        if (keys["ArrowUp"]) {
          obj2.y -= obj2.speed;
        }
        if (keys["ArrowLeft"]) {
          obj2.x -= obj2.speed;
        }
        if (keys["ArrowDown"]) {
          obj2.y += obj2.speed;
        }
        if (keys["ArrowRight"]) {
          obj2.x += obj2.speed;
        }

        // Keep the objects within the screen
        [obj1, obj2].forEach((obj) => {
          if (obj.x + obj.width > window.innerWidth) {
            obj.x = window.innerWidth - obj.width;
          }
          if (obj.x < 0) {
            obj.x = 0;
          }
          if (obj.y + obj.height > window.innerHeight) {
            obj.y = window.innerHeight - obj.height;
          }
          if (obj.y < 0) {
            obj.y = 0;
          }
        });

        // Move the ball
        if (!gamePaused) {
          ball.x += ball.speedX;
          ball.y += ball.speedY;
        }

        // Bounce the ball off the top and bottom walls
        if (
          ball.y + ball.radius > window.innerHeight ||
          ball.y - ball.radius < 0
        ) {
          ball.speedY = -ball.speedY;
        }

        // Bounce the ball off the objects
        [obj1, obj2].forEach((obj) => {
          if (
            ball.x + ball.radius > obj.x &&
            ball.x - ball.radius < obj.x + obj.width &&
            ball.y + ball.radius > obj.y &&
            ball.y - ball.radius < obj.y + obj.height
          ) {
            ball.speedX = -ball.speedX;
          }
        });

        // Reset the ball if it hits the left or right wall
        if (ball.x + ball.radius > window.innerWidth) {
          ball.x = window.innerWidth / 2;
          ball.y = window.innerHeight / 2;
          gamePaused = true;
          scoreBlack++;
          document.getElementById("score-black").textContent = scoreBlack;
        }
        if (ball.x - ball.radius < 0) {
          ball.x = window.innerWidth / 2;
          ball.y = window.innerHeight / 2;
          gamePaused = true;
          scoreRed++;
          document.getElementById("score-red").textContent = scoreRed;
        }
      }

      // The game loop
      function gameLoop() {
        update();
        draw();

        // Request the next animation frame
        window.requestAnimationFrame(gameLoop);
      }

      // Start the game loop
      window.onload = function () {
        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gameLoop();
      };

      // Event listeners for key presses
      window.addEventListener("keydown", function (event) {
        keys[event.key] = true;

        if (event.key === " ") {
          gamePaused = false;
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

      window.addEventListener("keyup", function (event) {
        keys[event.key] = false;
      });
    