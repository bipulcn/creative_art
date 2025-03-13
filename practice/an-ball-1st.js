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
  bx = new MBox({x:200, y: 300, h: 120, w: 180, color: 'green'});
  let box = new Box({x:width*0.5, y:height*0.1, width:100, height:100, color:'red', w: width, h:height}); // create a box at position (100, 100) with width 100 and height 100, color red, and type 'box'
  for(let i=0; i< 10000; i++){
    let rx = random.range(0, width);
    let ry = random.range(0, height);
    const obj = new Ball({x: rx, y: ry, radious: 10, color: 'blue', width:width, height:height});
    balls.push(obj);
  }
  // console.log(random.value());
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    balls.forEach((obj)=>{
      obj.draw(context);
      obj.update();
    });
    
    box.draw(context);
    box.update();
    bx.draw(context);
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

class MBox {
  constructor({x, y, w, h, color}) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w*0.5, -this.h*0.5, this.w, this.h);
    ctx.restore();
  }
}

class Ball {
  constructor({x = 0, y = 0, radious = 100, color = 'red', width=1000, height=1000}) {
    this.x = x;
    this.y = y;
    this.radious = radious;
    this.color = color;
    let rx = random.range(0, 100)/25
    let ry = random.range(0, 100)/25
    this.sx = (random.value()<0.5)? -1*rx: rx;//(random.range());
    this.sy = (random.value()<0.5)? -1*ry: ry;
    this.px = 0;
    this.py = 0;
    this.w = width;
    this.h = height;
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
  update() {
    this.x += this.sx;
    this.y += this.sy;
    if(this.x > this.w || this.x < 0) {
      this.sx = -this.sx;
      // this.x = this.w-this.radious;
    }
    if(this.y > this.h || this.y < 0) {
      this.sy = -this.sy;
      // this.y = this.h-this.radious;
    }
    // console.log(this.x, this.y);
  }
}


class Box {
  constructor({x, y, width, height, color, w, h}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.w = w;
    this.h = h;
    this.color = color;
    this.spx = 0;
    this.spy = 0;
    this.g = 0.95; // gravity
    this.ax = 0.001; // Accelaration
    this.f = 0;
  }
  update() {
    if(this.spy>=0)
      this.f += this.ax;
    else this.f -= this.ax;
    this.spy += this.f;
    this.x += this.spx;
    this.y += this.spy*this.g;
    if(this.y > this.w) {
      this.spy = -this.spy*this.g;
      // this.f = -this.f;
      this.y = this.w-this.height;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

}