const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
};

const sketch = ({width, height}) => {
  let bal = new Ball(width*0.25, height *0.5, 20);
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    bal.update();
    bal.draw(context);
  };
};


class Ball {
  constructor(x, y, radius) {
    // position
    this.x = x;
    this.y = y;
    this.radius = radius;

    // velocity
    this.vx = 0;
    this.vy = 0;
    
    // acceleration
    this.ax = 0.1;
    this.ay = 0.1;

    // initial postion
    this.ix = x;
    this.iy = y;
  }
  update() {
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
    if(this.x < 0 || this.x > 2028) {
      this.vx = -this.vx;
      this.ax = -this.ax;
    }
    if(this.y < 0 || this.y > 2028) {
      this.vy = -this.vy;
      this.ay = -this.ay;
    }
    if(this.vx >10) this.vx = 10;
    if(this.vx <-10) this.vx = -10;
    if(this.vy >10) this.vy = 10;
    if(this.vy <-10) this.vy = -10;
    // console.log(this.x, this.y);
  }

  draw(context) {
    context.save();
    context.beginPath();
    context.translate(this.x, this.y);
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
    context.font = "48px serif";
    context.fillStyle = "white";
    context.fillText(`${this.vx}`, 10, 50);
    context.restore();
  }
}

canvasSketch(sketch, settings);
