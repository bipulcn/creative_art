const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const color = require('canvas-sketch-util/color');

const settings = {
  dimensions: [1024, 1024], 
  animate: true,
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h, fill, stroke, blend;
  let num=40;
  let degrees = -30;
  let rects = [];
  const rectColor = [
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
  ]

  const bgcolor = random.pick(risoColors).hex;

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(600, width);
    h = random.range(40, 200);
    stroke = random.pick(rectColor);
    fill = random.pick(rectColor);
    blend = (random.value()>0.5)? 'overlay': 'source-over';
    rects.push({ x, y, w, h, fill, stroke });
  }
  return ({ context, width, height }) => {
    context.fillStyle = bgcolor;
    context.fillRect(0, 0, width, height);

    rects.forEach(rect=> {
      const {x, y, w, h, fill, stroke, blend} = rect;
      context.save();
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;

      context.globalCompositeOperation = blend;
      drawSkewRect({ context, w, h, degrees });
      
      shadowColor = color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5; 
      context.shadowColor = color.style(shadowColor.rgba);  // Add shadow color here
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;
      context.fill()
      context.shadowColor = null;
      context.stroke();
      context.globalCompositeOperation = 'source-over';
      
      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke();

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
