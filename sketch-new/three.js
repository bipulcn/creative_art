const canvasSketch = require('canvas-sketch');

// [ PASTE THE resolveCollision and rotate FUNCTIONS HERE ]

// --- Settings ---
const settings = {
  dimensions: [ 600, 600 ],
  animate: true
};

// --- 1. The Ball Class ---
class Ball {
  constructor(x, y, radius, width, height) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocityX = (Math.random() - 0.5) * 5;
    this.velocityY = (Math.random() - 0.5) * 5;
    
    // Mass is proportional to the area (PI * r^2)
    // We can just use r^2 for simplicity
    this.mass = this.radius * this.radius; 
    
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  draw(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }

  // Update position and check for wall bounces
  update(width, height) {
    if (this.x + this.radius > width || this.x - this.radius < 0) {
      this.velocityX *= -1;
    }
    if (this.y + this.radius > height || this.y - this.radius < 0) {
      this.velocityY *= -1;
    }
    if(this.velocityX>4) this.velocityX = .5 * Math.sign(this.velocityX);
    if(this.velocityY>4) this.velocityY = .5 * Math.sign(this.velocityY);
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}

// --- 2. The Sketch Function ---
const sketch = ({ width, height }) => {
  
  // --- Setup (runs once) ---
  const balls = [];
  const numBalls = 10;

  for (let i = 0; i < numBalls; i++) {
    const radius = Math.random() * 15 + 5; // Radius between 5 and 20
    const x = Math.random() * (width - radius * 2) + radius; 
    const y = Math.random() * (height - radius * 2) + radius;
    
    // *** Fix: Avoid spawning balls on top of each other ***
    if (i !== 0) {
      for (let j = 0; j < balls.length; j++) {
        const dx = x - balls[j].x;
        const dy = y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < radius + balls[j].radius) {
          // If overlapping, re-generate position
          // This isn't perfect, but helps
          // x = ... y = ... (reset and restart loop 'j' or 'i')
          // For simplicity, we'll just allow some overlap at start
        }
      }
    }
    balls.push(new Ball(x, y, radius));
  }

  // --- Render (runs repeatedly) ---
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // --- 1. Update positions and do wall bounces ---
    balls.forEach(ball => {
      ball.update(width, height); 
    });

    // --- 2. Check for and resolve ball-to-ball collisions ---
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const ball1 = balls[i];
        const ball2 = balls[j];
        
        // Calculate distance between centers
        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const sumOfRadii = ball1.radius + ball2.radius;

        // If distance is less than sum of radii, they are colliding
        if (distance < sumOfRadii) {
          // Collision detected! Resolve it.
          resolveCollision(ball1, ball2);
          
          // *** Optional: Fix "sticking" balls by pushing them apart ***
          // This is a simple position correction
          const overlap = 0.5 * (sumOfRadii - distance + 1);
          const nx = dx / distance; // Normalized x
          const ny = dy / distance; // Normalized y
          
          ball1.x -= nx * overlap;
          ball1.y -= ny * overlap;
          ball2.x += nx * overlap;
          ball2.y += ny * overlap;
        }
      }
    }

    // --- 3. Draw all balls in their final positions ---
    balls.forEach(ball => {
      ball.draw(context);
    });
  };
};

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and one angle, and returns rotated velocities
 */
function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };
  return rotatedVelocities;
}

/**
 * Swaps velocities of two colliding particles in a 1D fashion
 *
 * @param  {Ball} ball1
 * @param  {Ball} ball2
 */
function resolveCollision(ball1, ball2) {
  const xVelocityDiff = ball1.velocityX - ball2.velocityX;
  const yVelocityDiff = ball1.velocityY - ball2.velocityY;

  const xDist = ball2.x - ball1.x;
  const yDist = ball2.y - ball1.y;

  // Prevent accidental overlap of balls
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding balls
    const angle = -Math.atan2(ball2.y - ball1.y, ball2.x - ball1.x);

    // Store mass of each ball (m1 and m2)
    const m1 = ball1.mass;
    const m2 = ball2.mass;

    // Rotate velocities
    const u1 = rotate({ x: ball1.velocityX, y: ball1.velocityY }, angle);
    const u2 = rotate({ x: ball2.velocityX, y: ball2.velocityY }, angle);

    // Velocity after 1D collision
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m1) / (m1 + m2),
      y: u2.y
    };

    // Rotate velocities back to original angle
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap ball velocities
    ball1.velocityX = vFinal1.x;
    ball1.velocityY = vFinal1.y;

    ball2.velocityX = vFinal2.x;
    ball2.velocityY = vFinal2.y;
  }
}

canvasSketch(sketch, settings);