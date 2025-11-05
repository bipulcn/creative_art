const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 600, 400 ], // Canvas size
  animate: true // Enable animation loop
};

class Square {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.dir = 1;
  }

  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.w, this.h);
    context.save();
    context.translate(this.x, this.y, this.w, this.h);
    context.fill();
    context.restore();
  }
}

const sketch = ({ width, height }) => {
  let bx1 = new Square(100, 100, 40, 40, 'red');
  let bx2 = new Square(250, 100, 30, 30, 'blue');
  // --- Setup (runs once) ---
  return ({context, width, height}) => {
    context.fillStyle = 'white'; // White background
    context.fillRect(0, 0, width, height);
    bx1.draw(context);
    bx2.draw(context);
    // context.fill();  
  };
};


canvasSketch(sketch, settings);