const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 600, 400 ], // Canvas size
  animate: true // Enable animation loop
};

const sketch = ({width, height}) => {
  let num = 50;
  let clr = ['#F004', '#00F8', '#0F08', '#F908', '#D0F8', '#F888', 'tomato'];
  let balls = [];
  for (let i = 0; i < num; i++) {
    let rx = Math.random()*width;
    let ry = Math.random()*height;
    let rd = Math.random()*10 + 10;
    let cl = Math.floor(Math.random()*clr.length);
    balls.push(new Ball(rx, ry, rd, clr[cl]));
  }

  // Return the render function
  return ({ context, width, height }) => {
    // Clear
    context.fillStyle = 'white'; // White background
    context.fillRect(0, 0, width, height);
    balls.forEach(ball => {
      ball.draw(context);
      ball.update(width, height );
    });
  };
};

class Ball {
  constructor(x, y, radius, color, speed = 4) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.radius = radius;
    this.color = color;
    this.dirX = Math.random()*2 - 1;
    this.dirY = Math.random()*2 - 1;
  }
  draw(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }
  update(width, height) {
    if (this.x + this.radius > width || this.x - this.radius < 0) {
      this.dirX *= -1; 
    }
    if (this.y + this.radius > height || this.y - this.radius < 0) {
      this.dirY *= -1;
    }

    this.x += this.speed * this.dirX;
    this.y += this.speed * this.dirY;
  }
}

canvasSketch(sketch, settings);