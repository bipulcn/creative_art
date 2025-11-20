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
    this.speed = 1;
    this.mass = (50-w)/7.0;
    console.log(this.dir*this.speed*this.mass);
    this.sibling = [];
  }

  draw(context) {
    context.fillStyle = this.color;
    // context.translate(this.x,this.y);
    // context.translate(this.x, this.y);
    context.beginPath();
    
    context.fillRect(this.x-this.w/2, this.y-this.h/2, this.w, this.h);
    
    context.save();
    context.restore();
  }
  update() {
    this.x += this.dir* this.speed * this.mass;
    if(this.x + this.w/2 > 600 || this.x - this.w/2< 0) this.dir *= -1;
    for(let i = 0; i < this.sibling.length; i++) {
      let dis = Math.sqrt(Math.pow(this.x - this.sibling[i].x, 2) + Math.pow(this.y - this.sibling[i].y, 2));
      if(dis < this.w/2 + this.sibling[i].w/2+this.mass) {
        this.dir *= -1;
        this.sibling[i].dir *= -1;
      }
    }
    // if(this.x+this.w/2 )
  }
}

const sketch = ({ width, height }) => {
  let bx1 = new Square(100, 100, 40, 40, 'red');
  let bx2 = new Square(250, 100, 30, 30, 'blue');
  // --- Setup (runs once) ---
  return ({context, width, height}) => {
    context.fillStyle = 'white'; // White background
    context.fillRect(0, 0, width, height);
    bx2.draw(context);
    bx1.draw(context);
    bx1.sibling = [bx2];
    bx2.sibling = [bx1];
    // context.fill();  
    bx1.update();
    bx2.update();
  };
};


canvasSketch(sketch, settings);