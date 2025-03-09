const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const Color = require("canvas-sketch-util/color");
const risoColors = require("riso-colors");

const setting = {
  dimensions: [1080, 1080],
  // animate: true
};

const bgcolor = random.pick(risoColors).hex;

const sketch = ({ context, width, height }) => {
  let x, y, w, h, fill, stroke, blend;
  // let radius, angle, rx, ry;
  const mask = {
    radious: width * 0.48,
    sides: 10,
    x: width * 0.5,
    y: height * 0.5,
  }
  const num = 80;
  const degrees = -15;

  const rects = [];

  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors)
  ];

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);
    op = random.range(40, 100) / 100;

    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;

    blend = random.value() > 0.5 ? "overlay" : "source-over";

    rects.push({ x, y, w, h, fill, stroke, blend, op });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgcolor;
    context.fillRect(0, 0, width, height);

    // context.save();

    context.translate(mask.x, mask.y);
    drawPolyShape({ context, radious: mask.radious - context.lineWidth, sides: mask.sides });

    context.clip();

    rects.forEach((rect) => {
      const { x, y, w, h, fill, stroke, blend, op } = rect;

      context.save();
      context.translate(width * -0.5, height * -0.5);
      let obj = new drawSkRect({ fill, blend, stroke, x, y, w, h, degrees });
      obj.draw(context);

      let shed = new shadowPrt({ fill: fill, strok: stroke, opacity: op });
      shed.draw(context);
      context.restore();
    });
    context.restore();
    context.save();

    context.translate(mask.x, mask.y);
    drawPolyShape({ context, radious: mask.radious - context.lineWidth * 2, sides: mask.sides });
    context.lineWidth = 20;
    context.globalCompositeOperation = 'color-burn';
    context.strokeStyle = rectColors[0];
    // context.fillStyle = '#FFFFFF';
    // context.fill();
    context.stroke();
    context.restore();
  };
};

canvasSketch(sketch, setting);
const drawPolyShape = ({ context, sides, radious = 450 }) => {
  const side = Math.PI * 2 / sides;
  context.beginPath();
  // context.moveTo(0, radious);
  for (let i = 0; i < sides; i++) {
    console.log(i);
    let evn = (sides % 2==0)? 1: 2;
    // let nang = ang * i  - Math.PI*(0.5 - evn/this.side);
    const theta = i * side - Math.PI * (0.5 - evn / sides);
    let x = Math.cos(theta) * radious;
    let y = Math.sin(theta) * radious;
    console.log(parseInt(x), parseInt(y));
    context.lineTo(x, y);
  }
  context.closePath();
}

class shadowPrt {
  constructor({ fill, strok, opacity }) {
    this.fill = fill;
    this.strok = strok;
    this.opacity = opacity;
  }

  draw(context) {
    let shadowColor = Color.offsetHSL(this.fill, 0, 0, -20);
    shadowColor.rgba[3] = this.opacity;

    context.shadowColor = Color.style(shadowColor.rgba);
    context.shadowOffsetX = -20;
    context.shadowOffsetY = 20;

    context.fill();
    context.shadowColor = null;
    context.stroke();

    context.globalCompositeOperation = "source-over";

    context.lineWidth = 7;
    context.strokeStyle = this.strok;
    context.stroke();
    // context.restore();
  }
}


class drawSkRect {
  constructor({ fill, blnd, strk, x = 0, y = 0, w = 600, h = 200, degrees = -45 }) {
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
  update() {
    this.x += 1;
    this.y += 1;
  }
}