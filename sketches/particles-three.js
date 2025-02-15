const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const eases = require('eases');

const settings = {
  dimensions: [1024, 1024],
  animate: true,
};

const particles = [];

const cursor = { x: 9999, y: 9999 };

let elCanvas;

const sketch = ({ width, height, canvas }) => {
  let x, y, particle, radious;
  let pos = [];
  const numCircles = 15;
  const gapCircle = 10;
  const gapDot = 4;
  let dotRadius = 12;
  let cirRadious = 0;
  const fitRadius = dotRadius; 

  elCanvas = canvas;
  canvas.addEventListener('mousedown', onMouseDown);

  for(let i=0; i< numCircles; i++) {
    const circumference = Math.PI * 2 * cirRadious;
    const numFit = i ? Math.floor(circumference /(fitRadius*2 + gapDot)): 1;
    const fitSlice = Math.PI * 2 / numFit;

    for(let j=0; j< numFit; j++) {
      const theta = fitSlice * j; 
      x = Math.cos(theta) * cirRadious;
      y = Math.sin(theta) * cirRadious;

      x += width * 0.5;
      y += height * 0.5;

      radious = dotRadius; 

      particle = new Particle({x: x, y: y, radius: radious});  
      particles.push(particle);
    }
    cirRadious += fitRadius * 2 + gapCircle;
    dotRadius = (1 - eases.quadOut(i / numCircles)) * fitRadius;
    console.log(dotRadius);
  }

  /*
  for (let i = 0; i < 200; i++) {
    x = width * 0.5;
    y = height * 0.5;

    random.insideCircle(400, pos);
    x += pos[0];
    y += pos[1];

    particle = new Particle({ x, y });

    particles.push(particle);
  }
    */
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.update();
      particle.draw(context);
    })
  };
};

const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  onMouseMove(e);
}
const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;
  cursor.x = x;
  cursor.y = y;
}
const onMouseUp = (e) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  cursor.x = 9999;
  cursor.y = 9999;
}

canvasSketch(sketch, settings);

class Particle {
  constructor({ x=0, y=0, radius = 10 }) {
    // position
    this.x = x;
    this.y = y;

    // acceleration
    this.ax = 0;
    this.ay = 0;

    // velocity
    this.vx = 0;
    this.vy = 0;

    // initial postion
    this.ix = x;
    this.iy = y;

    this.radius = radius;

    this.minDist = random.range(100, 200);
    this.pushFactor = random.range(0.01, 0.02);
    this.pullFactor = random.range(0.002, 0.006);
    this.dampFactor = random.range(0.90, 0.95);
  }

  update() {
    // console.log(this.x, this.ix);
    let dx, dy, dd, distDelta;

    // pull force
    dx = this.ix - this.x;
    dy = this.iy - this.y;
    // console.log(dx, this.ix, this.x);
    
    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    // Push force
    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * distDelta * this.pushFactor;
      this.ay += (dy / dd) * distDelta * this.pushFactor;
    }

    this.vx += this.ax;
    this.vy += this.ay;
    
    this.vx *= this.dampFactor;
    this.vy *= this.dampFactor;

    this.x += this.vx;
    this.y += this.vy;
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}   