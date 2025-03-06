const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const Color = require("canvas-sketch-util/color");
const risoColors = require("riso-colors");

const setting = {
  dimensions: [1080, 1080],
  animate: true
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h, fill, stroke, blend;
  // let radius, angle, rx, ry;

  const num = 80;
  const degrees = -15;

  const rects = [];

  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors)
  ];

  const bgColor = random.pick(rectColors).hex;

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);

    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;

    blend = random.value() > 0.5 ? "overlay" : "source-over";

    rects.push({ x, y, w, h, fill, stroke, blend });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      const { x, y, w, h, fill, stroke, blend } = rect;


      let obj = new drawSkRect({fill, stroke, x, y, w, h, degrees });
      obj.draw(context);
      let shed = new shadowPrt({fill: fill, strok: stroke });
      shed.draw(context);
    });
    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.restore();
  };
};
canvasSketch(sketch, setting);

const shadowPart = ({ context, fill, strok }) => {
  shadowColor = Color.offsetHSL(fill, 0, 0, -20);
  shadowColor.rgba[3] = 0.5;

  context.shadowColor = Color.style(shadowColor.rgba);
  context.shadowOffsetX = -20;
  context.shadowOffsetY = 20;

  context.fill();
  context.shadowColor = null;
  context.stroke();

  context.globalCompositeOperation = "source-over";

  context.lineWidth = 2;
  context.strokeStyle = strok;
  context.stroke();
  context.restore();
}

class shadowPrt {
  constructor({ fill, strok }) {
    this.fill = fill;
    this.strok = strok;
  }

  draw(context) {
    let shadowColor = Color.offsetHSL(this.fill, 0, 0, -20);
    shadowColor.rgba[3] = 0.5;

    context.shadowColor = Color.style(shadowColor.rgba);
    context.shadowOffsetX = -20;
    context.shadowOffsetY = 20;

    context.fill();
    context.shadowColor = null;
    context.stroke();

    context.globalCompositeOperation = "source-over";

    context.lineWidth = 2;
    context.strokeStyle = this.strok;
    context.stroke();
    context.restore();
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
  }
  draw(context) {    
    context.save();
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