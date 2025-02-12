const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  const point = [
    new Point({x:200, y:540}),
    new Point({x:500, y:300, control:true}),
    new Point({x:800, y:540})
  ]
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(point[0].x, point[0].y);
    context.quadraticCurveTo(point[1].x, point[1].y, point[2].x, point[2].y);
    context.stroke();
    point.forEach(point => {
      point.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Point{
  constructor({x, y, control=false}){
    this.x = x;
    this.y = y;
    this.control = control;
  }

  draw(context){
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? 'red': 'black';
    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI*2);
    context.fill();
    context.restore();
  }
}
