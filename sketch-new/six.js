const canvasSketch = require('canvas-sketch');
const settings = {  dimensions: [ 600, 600 ],  animate: true};

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    // VELOCITY
    this.vx = (Math.random() - 0.5) * 4; // Random horizontal speed
    this.vy = 0; // Vertical speed starts at 0 (it drops)
    // PHYSICS CONSTANTS
    this.gravity = 0.25; // Force pulling down
    this.bounceFactor = -0.8; // Energy kept after bounce (negative to reverse)
  }
  update(width, height) {
    // 1. Apply Gravity to Velocity     // Gravity keeps increasing the downward speed
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
  }
  draw(context) {
    context.fillStyle = 'tomato';
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();    
    // Optional: Add a black outline
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
  }
}
const sketch = () => {
  // Create a bunch of balls starting in the middle
  const balls = [];
  for (let i = 0; i < 10; i++) {
    balls.push(new Ball(300, 100)); // Start them high up
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    balls.forEach(ball => {
      ball.update(width, height);
      ball.draw(context);
    });
  };
};
canvasSketch(sketch, settings);