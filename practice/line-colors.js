const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const colormap = require('colormap');

const settings = {
  dimensions: [ 2048, 2048 ], 
  animate: true,
};

const sketch = ({width, height}) => {
  let lines = [];
  lines.push(new Line(600, 200, 300, 'red'));
  lines.push(new Line(1050, 200, 300, 'blue'));
  lines.push(new Line(width*0.5, width*0.5, 500, 'green'));
  lines.push(new Line(width*0.5, width*0.77, 500, 'purple'));
  let offset = 0;
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    lines.forEach(line => {
      // context.lineDashOffset = offset;
      line.draw(context);
    });
    // offset += 1;
  };
};

canvasSketch(sketch, settings);

class Line {
  constructor(x1, y1, x2, color) {
    // position
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.color = color;
    this.offset = 0;
  }
  draw(context) {
    context.save();
    context.strokeStyle = this.color;
    context.lineWidth = 8;
    context.translate(this.x1, this.y1);
    context.beginPath();
    context.setLineDash([24, 10, 5, 10]);
    context.lineDashOffset = this.offset;
    context.strokeRect(-this.x2*0.5, -this.x2*0.5, this.x2*1.41, this.x2);
    context.stroke();
    context.restore();
    this.offset += 1;
  }
}