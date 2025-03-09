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
    op = random.range(40, 100)/100;

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

      let obj = new drawSkRect({fill, blend, stroke, x, y, w, h, degrees });
      obj.draw(context);
      
      let shed = new shadowPrt({fill: fill, strok: stroke, opacity: op });
      shed.draw(context);

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

const drawPolyShape = ({context, sides, radious=450}) => {
  const side = Math.PI * 2 / sides;
  // console.log(radious);
  context.beginPath();
  context.moveTo(0, -radious);
  for (let i = 1; i < sides; i++) {
    const theta = i * side - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radious, Math.sin(theta) * radious);
  }
  context.closePath();
}

canvasSketch(sketch, settings);


class shadowPrt {
  constructor({ fill, strok, opacity }) {
    this.fill = fill;
    this.strok = strok;
    this.opacity = opacity;
  }

  draw(context) {
    let shadowColor = color.offsetHSL(this.fill, 0, 0, -20);
    shadowColor.rgba[3] = this.opacity;

    context.shadowColor = color.style(shadowColor.rgba);
    context.shadowOffsetX = -20;
    context.shadowOffsetY = 20;

    context.fill();
    context.shadowColor = null;
    context.stroke();

    context.globalCompositeOperation = "source-over";

    context.lineWidth = 6;
    context.strokeStyle = this.strok;
    context.stroke();
  }
}

class drawSkRect {
  constructor({ fill, blnd, strk, x=0, y=0, w = 600, h = 200, degrees = -45 }) {
    this.cfill = fill;
    this.blend = blnd;
    this.stroke = strk;
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.angle = math.degToRad(degrees);
    this.rx = Math.cos(this.angle) * w;
    this.ry = Math.sin(this.angle) * w;
    this.mx = this.x;
    this.my = this.y;
  }
  draw(context) {    
    context.translate(this.x, this.y);
    context.strokeStyle = this.stroke;
    context.fillStyle = this.cfill;
    context.lineWidth = 10;

    context.globalCompositeOperation = this.blend;

    context.save();
    context.translate(this.rx * -0.5, (this.ry + this.h) * -0.5);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.rx, this.ry);
    context.lineTo(this.rx, this.ry + this.h);
    context.lineTo(0, this.h);
    context.closePath();
    context.restore();
  }
}