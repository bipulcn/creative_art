const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [600, 600],
  animate: true
};

let balls = [];
let colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'black', 'brown', 'cyan', 'magenta', 'lime', 'teal', 'navy', 'maroon', 'olive', 'gold'];
class Ball {
  constructor(x, y) {
    this.num = 0;
    this.x = x;
    this.y = y;
    this.radius = 20;

    // VELOCITY
    this.vx = (Math.random() - 0.5) * 4; // Random horizontal speed
    this.vy = 0; // Vertical speed starts at 0 (it drops)

    // PHYSICS CONSTANTS
    let rndg = Math.random() * 0.25;
    this.gravity = 0.05 + rndg; // Force pulling down
    let rnd = Math.random() * 0.25;
    this.bounceFactor = -0.95 + rnd; // Energy kept after bounce (negative to reverse)

    let r = getRandomInteger(0, 255);
    let g = getRandomInteger(0, 255);
    let b = getRandomInteger(0, 255);
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(width, height) {
    // 1. Apply Gravity to Velocity
    // Gravity keeps increasing the downward speed
    this.vy += this.gravity;

    // 2. Apply Velocity to Position
    this.x += this.vx;
    this.y += this.vy;

    // 3. Check Floor Collision
    if (this.y + this.radius > height) {
      // Snap to floor (prevents getting stuck)
      this.y = height - this.radius;

      // Bounce! (Reverse velocity and lose some energy)
      this.vy *= this.bounceFactor;
    }

    // 4. Check Wall Collision (Just simple bouncing)
    if (this.x + this.radius > width || this.x - this.radius < 0) {
      this.vx *= -1;
      // Keep inside bounds
      if (this.x - this.radius < 0) this.x = this.radius;
      if (this.x + this.radius > width) this.x = width - this.radius;
    }

    if (this.num == this.y) {
      this.isDead = true;
    }
    this.num = this.y;
  }

  draw(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();

    // Optional: Add a black outline
    context.strokeStyle = 'grey';
    context.lineWidth = 2;
    context.stroke();
  }
}
function getRandomInteger(min, max) {
  min = Math.ceil(min); // ensures min is integer
  max = Math.floor(max); // ensures max is integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const sketch = ({ context, width, height, canvas }) => {
  canvas.onmousedown = onMouseDown;
  // Create a bunch of balls starting in the middle
  for (let i = 0; i < 10; i++) {
    balls.push(new Ball(50 + i * 50, 100)); // Start them high up
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    balls.forEach(ball => {
      if (!ball.isDead) {
        ball.update(width, height);
        ball.draw(context);
      }
    });

  };
};

const onMouseDown = (e) => {
  balls.push(new Ball(e.offsetX, e.offsetY)); // Start them high up
}

canvasSketch(sketch, settings);