const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [2048, 2048], 
  animate: true,
};

const sketch = ({width, height}) => {
  let box = new Box({x:width*0.5, y:height*0.1, width:100, height:100, color:'red', type:'box', w: width, h:height}); // create a box at position (100, 100) with width 100 and height 100, color red, and type 'box'
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    box.draw(context);
    box.update();
  };
};

canvasSketch(sketch, settings);

class Box {
  constructor({x, y, width, height, color, type, w, h}) {
    // position
    this.type = this.type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.w = w;
    this.h = h;
    this.color = color;
    this.bx = -10;
    this.by = -10;
    this.spx = 0;
    this.spy = 0;
    this.g = 0.95; // gravity
    this.ax = 0.001; // Accelaration
    this.gs = 0;  // gravity speed
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