const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const color = require('canvas-sketch-util/color');

// const seed = Date.now();
const seed = random.getRandomSeed();

const settings = {
  dimensions: [1024, 1024], 
  animate: true,
  name: seed,
};

const sketch = ({ context, width, height }) => {
  random.setSeed(seed);
  let x, y, w, h, fill, stroke, blend;
  let num=40;
  let degrees = -45;
  let rects = [];
  const rectColor = [
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
  ]

  const bgcolor = random.pick(risoColors).hex;

  const mask = {
    radious: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.58,
  }

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

    context.save();

    context.translate(mask.x, mask.y);
    
    drawPolyShape({context, red: mask.radious, sides: mask.sides });
    
    context.clip();

    rects.forEach(rect=> {
      const {x, y, w, h, fill, stroke, blend} = rect;
      context.save();
      context.translate(width * -0.5, height * -0.5);
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
    
    context.restore();
    
    context.save()
    context.translate(mask.x, mask.y);
    drawPolyShape({context, red: mask.radious - context.lineWidth, sides: mask.sides });
    context.lineWidth = 20;
    context.globalCompositeOperation = 'color-burn';
    context.strokeStyle = rectColor[0];
    context.stroke(); 
    
    context.restore();

  };
};

const drawSkewRect = ({ context, w = 600, h = 200, degrees = 30 }) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
  context.restore();
}

const drawPolyShape = ({context, sides, radious=450}) => {
  const side = Math.PI * 2 / sides;
  console.log(radious);
  context.beginPath();
  context.moveTo(0, -radious);
  for (let i = 1; i < sides; i++) {
    const theta = i * side - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radious, Math.sin(theta) * radious);
  }
  context.closePath();
}

canvasSketch(sketch, settings);
