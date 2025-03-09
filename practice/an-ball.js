const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ], 
  animate: true,
};
const sketch = ({width, height, canvas}) => {
  canvas.addEventListener('mousedown', onMouseDown);
  return ({ context, width, height }) => {
    context.fillStyle = '#DDEDFD99';
    context.fillRect(0, 0, width, height);
    context.save();
    const obj = new ball({x: width*0.5, y: height*0.5, radious: 30, color: 'blue'});
    obj.draw(context);

    context.restore();
  };
};

const onMouseDown = (event) => {
  const x = event.clientX;
  const y = event.clientY;
  console.log(x, y);
}

canvasSketch(sketch, settings);

class ball {
  constructor({x = 0, y = 0, radious = 100, color = 'red'}) {
    this.x = x;
    this.y = y;
    this.radious = radious;
    this.color = color;
    this.speed = 1;
    this.px = 0;
    this.py = 0;
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.arc(this.px, this.py, this.radious, 0, Math.PI * 2);
    context.strokeStyle = this.color;
    context.lineWidth = 8;
    context.stroke();
    context.restore();
  }
  update() {
    this.px += this.speed;
    this.py += this.speed;
    console.log(this.px, this.py);
  }
}