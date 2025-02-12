const canvasSketch = require('canvas-sketch');
const color = require('canvas-sketch-util/color');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

const settings = {
  dimensions: [1048, 1048]
};

const sketch = () => {
  let clrRect = [
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
  ]

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.translate(width * 0.5, height * 0.5);
    context.lineWidth = 10;
    context.strokeStyle = clrRect[2];
    context.fillStyle = clrRect[0];
    shadowColor = color.offsetHSL(context.strokeStyle, 0, 0, -20);
    shadowColor.rgba[3] = 0.35;
    context.shadowBlur = 10;
    context.shadowColor = color.style(shadowColor.rgba);
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    // context.save();
    createShape({ context, x:-100, y:-100, width: 200, height: 200 });
    context.fill();
    context.stroke();
    triShape({context, x:100, y:0, width: 300, height: 100});
    context.fill();
    context.stroke();
    createShape({ context, x: -25, y: 50, width: 50, height: 150 });
    context.fill();
    context.stroke();
    // context.restore();
  };
};

const createShape = ({ context, x, y, width, height }) => {
  context.translate(x, y);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, height);
  context.lineTo(width, height);
  context.lineTo(width, 0);
  context.closePath();
};
const triShape = ({context, x, y, width, height}) => {
  context.translate(x, y);
  context.beginPath();
  context.moveTo(-width*0.5, 0);
  context.lineTo(0, -height);
  context.lineTo(width*0.5, 0);
  context.closePath();
}


canvasSketch(sketch, settings);
