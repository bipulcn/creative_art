const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1024, 1024], 
  animate: true,
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h;
  let num=20;
  let degrees = -30;
  let rects = [];

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);
    stroke = 'black';
    fill = `rgba(${random.range(40, 255)}, ${random.range(40, 255)}, ${random.range(40, 255)}, 0.9)`;
    rects.push({ x, y, w, h, fill, stroke });
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    rects.forEach(rect=> {
      const {x, y, w, h, fill, stroke} = rect;
      context.save();
      context.translate(x, y);
      context.skrokeStyle = stroke;
      context.fillStyle = fill;
      drawSkewRect({ context, w, h, degrees });
      context.stroke();
      context.fill();
      context.restore();
    });

  };
};

const drawSkewRect = ({ context, w = 600, h = 200, degrees = 30 }) => {
  context.save();
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;
  context.translate(rx * -0.5, (ry + h) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
  context.stroke();

  context.restore();
}

canvasSketch(sketch, settings);
