const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = ({width, height}) => {
  let sqrs = Pos(width, height, 180, 50);
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    sqrs.forEach(sqr=>{
      sqr.draw(context);
    });
  };

};

let Pos = (width, height, w, g)=>{
  let sqrs = [];
  let xp = Math.floor(width/(w+g));
  let yp = Math.floor(height/(w+g));
  for(let i =0; i<xp; i++) {
    for(let j =0; j<yp; j++) {
      let nx = (w*0.5+g) + i*(w+g);
      let ny = (w*0.5+g) + j*(w+g);
      if(random.boolean()) {
        sqrs.push( new Square({x: nx, y: ny, w: w, lw:5, color:'red'}));
        let nw = w*random.range(0.4, 0.9);
        let rot = random.range(0, 90);
        sqrs.push( new Square({x: nx, y: ny, w: nw, lw:5, color:'white', ang:rot}));
        if(random.boolean()) {
          sqrs.push( new Square({x: nx, y: ny, w: nw*random.range(0.2, 0.9), lw:5, color:'red', ang:rot*1.3}));
        }
      }
      else {
        sqrs.push( new Square({x: nx, y: ny, w: w*random.range(0.2, 0.9), lw:5, color:'red', ang:50}));
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
    context.save();
    context.fillStyle = this.color;
    context.lineWidth = this.lw;
    context.translate(this.x, this.y);
    // context.rotate(180 * this.angle / Math.PI);
    context.rect(-this.w*0.5, -this.w*0.5, this.w, this.w);
    context.stroke();
    context.restore();
  }
}