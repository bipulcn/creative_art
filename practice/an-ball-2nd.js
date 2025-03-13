const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 2048, 2048 ], 
  animate: true,
};

let cnvs = null;
let bx;
let balls = [];
// const ctn = cnvs.getContext('2d');

const sketch = ({width, height, canvas}) => {
  canvas.addEventListener('mousedown', onMouseDown);
  cnvs = canvas;
  for(let i=0; i< 100; i++){
    for(let j=0; j< 100; j++){
      let rx = i*20.5;
      let ry = j*20.5;
      let r = (10000-i*j)*0.025;
      let g = i*2.5;
      let b = j*2.5
      let col = `rgb(${r},${g},${b})`;
      const obj = new Ball({x: rx, y: ry, radious: 10, color: col, width:width, height:height});
      balls.push(obj);
    }
  }
  // console.log(random.value());
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    balls.forEach((obj)=>{
      obj.draw(context);
    });
  };
};

let ob = [x=0, y=0];
const onMouseDown = (en) => {
  cnvs.addEventListener('mousemove', onMouseMove);
  cnvs.addEventListener('mouseup', onMouseUp);
  let x = en.clientX;
  let y = en.clientY;
  const rc = cnvs.getBoundingClientRect();
  const cx = (x - rc.left)/(rc.right - rc.left) * cnvs.width;
  const cy = (y - rc.top)/(rc.bottom - rc.top) * cnvs.height;
  ob.x = bx.x -cx;
  ob.y = bx.y -cy;
  if(Math.abs(ob.x)< bx.w*0.5 && Math.abs(ob.y)< bx.h*0.5)
    bx.isDragging = true;
  else bx.isDragging = false;
}
const onMouseMove = (en) => {
  let x = en.clientX;
  let y = en.clientY;
  const rc = cnvs.getBoundingClientRect();
  const cx = (x - rc.left)/(rc.right - rc.left) * cnvs.width;
  const cy = (y - rc.top)/(rc.bottom - rc.top) * cnvs.height;
  if(bx.isDragging) {
    bx.x = cx + ob.x;
    bx.y = cy + ob.y;
  }
}
const onMouseUp = (en) => {
  cnvs.removeEventListener('mousemove', onMouseMove);
  cnvs.removeEventListener('mousedown', onMouseUp);
}

canvasSketch(sketch, settings);

class Ball {
  constructor({x = 0, y = 0, radious = 100, color = 'red', width=1000, height=1000}) {
    this.x = x;
    this.y = y;
    this.radious = radious;
    this.color = color;
  }
  draw(context) {
    context.save();
    context.fillStyle = this.color;
    context.translate(this.x, this.y);
    context.beginPath();
    context.arc(0,0, this.radious, 0, Math.PI * 2);
    context.lineWidth = 8;
    context.fill();
    context.closePath();    
    context.restore();
  }
  // update() {
  //   this.x += this.sx;
  //   this.y += this.sy;
  //   if(this.x > this.w || this.x < 0) {
  //     this.sx = -this.sx;
  //     // this.x = this.w-this.radious;
  //   }
  //   if(this.y > this.h || this.y < 0) {
  //     this.sy = -this.sy;
  //     // this.y = this.h-this.radious;
  //   }
  //   // console.log(this.x, this.y);
  // }
}
