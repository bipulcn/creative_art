const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const Color = require("canvas-sketch-util/color");

const settings = {
  dimensions: [ 2048, 2048 ],
  // animate:true,
};

const rectClr = [
  random.pick(risoColors),
  random.pick(risoColors),
  random.pick(risoColors),
  random.pick(risoColors),
]

const sketch = ({width, height}) => {
  let sqrs = Pos(width, height, 180, 22);
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    sqrs.forEach(sqr=>{
      context.save();
      sqr.draw(context);
      context.restore();
    });
  };

};

let Pos = (width, height, w, g)=>{
  let sqrs = [];
  let xp = Math.floor(width/(w+g*0.5));
  let yp = Math.floor(height/(w+g*0.5));
  let fill = random.pick(rectClr).hex;
  for(let i =0; i<xp; i++) {
    for(let j =0; j<yp; j++) {
      let nx = (w*0.5+g) + i*(w+g);
      let ny = (w*0.5+g) + j*(w+g);
      fill = random.pick(rectClr).hex;
      if(random.boolean()) {
        sqrs.push( new Square({x: nx, y: ny, w: w, lw:5, color:fill}));
        let nw = w*random.range(0.4, 0.9);
        let rot = random.range(0, 90);
        fill = random.pick(rectClr).hex;
        sqrs.push( new Square({x: nx, y: ny, w: nw, lw:5, color:fill, ang:rot}));
        if(random.boolean()) {
          fill = random.pick(rectClr).hex;
          sqrs.push( new Square({x: nx, y: ny, w: nw*random.range(0.2, 0.9), lw:5, color:fill, ang:rot*1.3}));
        }
      }
      else {
        sqrs.push( new Square({x: nx, y: ny, w: w*random.range(0.2, 0.9), lw:5, color:fill, ang:50}));
      }
    }
  }
  return sqrs;
}

canvasSketch(sketch, settings);

class Square {
  constructor({x, y, w, lw, color, ang}) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.lw = lw;
    this.color = color;
    this.angle = ang;
  }
  
  draw(context) {
    let shadowColor;
    context.save();
    let num = parseInt(random.range(0, 255));
    context.fillStyle = this.color+num.toString(16);
    context.strokeStyle = this.color;
    context.lineWidth = this.lw;
    // context.globalCompositeOperation = 'overlay';
    context.translate(this.x, this.y);
    context.beginPath();
    // context.rotate(180 * this.angle / Math.PI);
    context.rect(-this.w*0.5, -this.w*0.5, this.w, this.w);
    context.fill();
    context.stroke();
    context.closePath();
    context.restore();
    // shadowColor = Color.offsetHSL(this.color, 0, 0, -20);
    // shadowColor.rgba[3] = 0.5;

    // context.shadowColor = Color.style(shadowColor.rgba);
    // context.shadowOffsetX = -10;
    // context.shadowOffsetY = 20;

    // context.fill();
    // context.shadowColor = null;
    // context.stroke();

    // context.globalCompositeOperation = "overlay";

    // context.lineWidth = 2;
    // context.strokeStyle = "white";
    // context.stroke();
    // context.restore();
  }
}