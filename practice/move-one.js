const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
  duration: 3,
  fps: 1,
};

let eCanvas, rx, ry, cunt =0;
let cursor = {x: 9999, y:9999};

const sketch = ({width, height, canvas}) => {
  eCanvas = canvas;
  let num = 100;
  rx = Math.floor(random.range(0, num));
  ry = Math.floor(random.range(0, num));
  canvas.addEventListener('mousedown', onMouseDown);
  let balls = [];
  for(let i = 0; i < num -1; i++) {
    for(let j =0; j < num -1; j++){
    balls.push( new Ball(50+width*(1/num)*i, 50+height*(1/num)*j, 10, i, j));
  }}
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    balls.forEach(bal=>{
    bal.update();
    bal.draw(context);
  });
  };
};

const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  onMouseMove(e);
}

const onMouseMove = (e) => {
  let x = (e.offsetX / eCanvas.offsetWidth) * eCanvas.width;
  let y = (e.offsetY / eCanvas.offsetHeight) * eCanvas.height;
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

class Ball {
  constructor(x, y, radius, px, py) {
    // position
    this.px = px;
    this.py = py;
    this.x = x;
    this.y = y;
    this.ax = this.ay = this.vx = this.vy= 0;
    this.ox = x;
    this.oy = y;
    this.radius = radius;
    this.minDis = 100;
    this.pushF = 0.02;
    this.pullF = 0.004;
    this.dumpF = 0.90;
    this.px = px;
    this.py = py;
    this.cunt = 0;
  }
  update() {
    let dx, dy, cd, dd;

    dx = this.ox - this.x;
    dy = this.oy - this.y;

    this.ax = dx * this.pullF;
    this.ay = dy * this.pullF;

    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    cd = Math.sqrt(dx * dx + dy * dy);
    dd = this.minDis - cd;
    if(cd < this.minDis) {
      this.ax += (dx / cd) * dd * this.pushF;
      this.ay += (dy / cd) * dd * this.pushF;
    }
    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.dumpF;
    this.vy *= this.dumpF;

    this.x += this.vx;
    this.y += this.vy;
    if(cunt>50000){
      rx = Math.floor(rx+random.range(-1.1, 2));
      ry = Math.floor(ry+random.range(-1.1, 2));
      if(rx<0) rx =0;
      if(ry<0) ry =0;
      if(rx>100) rx = 100;
      if(ry>100) ry = 100;
      cunt = 0;
    }else cunt++;
  }
  draw(context) {
    // setTimeout(function(){
      // requestAnimationFrame(this.Function.draw);
      context.save();
      context.beginPath();
      context.translate(this.x, this.y);
      context.arc(0, 0, this.radius, 0, 2 * Math.PI);
      if(this.px==rx && this.py==ry) {context.fillStyle = 'red';context.scaleX = 1.5;}
      else
        context.fillStyle = 'skyblue';
      context.fill();
      context.restore();
    // }, 1000/10);
  }
}
/*
setTimeout(function() {
        requestAnimationFrame(draw);
        // Drawing code goes here
    }, 1000 / fps);
*/