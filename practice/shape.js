const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const riso = require('riso-colors');
const color = require('canvas-sketch-util/color');
const colormap = require('colormap');

const settings = {
  dimensions: [2048, 2048],
  // animate: true
};

const sketch = ({ width, height }) => {
  let shapes = [];
  let x = 50, y = 50, r = 40;
  let prt = 0.5 * (width - r - 2 * x) / (1.5 * r);
  let amplitude = prt * 4.4;
  let row = r * Math.sin(math.degToRad(60));
  console.log(math.mapRange(1, -10, 10, 0, 10));
  const color1 = colormap({
    colormap: 'cool',//'magma',
    nshades: amplitude * 2,
  });
  console.log(color1.length);
  const color2 = colormap({
    colormap: 'summer',//'magma',
    nshades: amplitude * 2,
  });
  let clrs = [
    random.pick(riso).hex,
    random.pick(riso).hex,
    random.pick(riso).hex,
  ]
  // let row = Math.sqrt(r*r + Math.pow(r*0.5, 2));
  for (let i = 0; i < prt; i++) {
    for (let j = 0; j < prt * 3.4; j++) {
      clrs = [
        color1[Math.floor(math.mapRange((i + j) - 2, -amplitude, amplitude, 0, amplitude))],
        // color1[Math.floor(math.mapRange(prt * 4.4 + (i + j) - 2, -amplitude, amplitude, 0, amplitude))],
        // color1[Math.floor(math.mapRange((i + j) - 2, amplitude, -amplitude, 0, amplitude))],
        // color1[Math.floor(math.mapRange(prt * 4.4 + (i + j) - 2, amplitude, -amplitude, 0, amplitude))],
        color2[Math.floor(math.mapRange((i + j) - 2, amplitude, -amplitude, 0, amplitude))],
        // color2[Math.floor(math.mapRange(prt * 4.4 + (i + j) - 2, amplitude, -amplitude, 0, amplitude))],
        // color2[Math.floor(math.mapRange((i + j) - 2, -amplitude, amplitude, 0, amplitude))],
        // color2[Math.floor(math.mapRange(prt * 4.4 + (i + j) - 2, -amplitude, amplitude, 0, amplitude))],
      ];
      let clr = random.pick(clrs);
      if (j % 2 == 0)
        shapes.push(new Shape(x + r * (i + 1) + 2 * r * i, y + row * (j + 1), r, 6, clr));
      else
        shapes.push(new Shape(x + r * (i + 1) + 2 * r * i + r * 1.5, row * (j + 1) + y, r, 6, clr));
    }
  }
  // shapes.push(new Shape(width*0.5, height*0.5, 150, 6, 'red'));
  // shapes.push(new Shape(width*0.4, height*0.4, 150, 6, 'red'));
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    shapes.forEach(shape => {
      shape.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Shape {
  constructor(x, y, radius, sides, color) {
    // position
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sides = sides;
    if (color == null) color = '#5EED93';
    let hnum = (Math.round(random.range(50, 255))).toString(16);
    color = color+hnum;
    this.color = color;
  }
  draw(context) {
    let ang = 360 / this.sides;
    context.save();
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.lineWidth = 1;
    context.translate(this.x, this.y);
    context.beginPath();

    for (let i = 0; i < this.sides; i++) {
      let red = math.degToRad(ang * i);
      let x = this.radius * Math.cos(red);
      let y = this.radius * Math.sin(red);
      context.lineTo(x, y);
    }
    context.closePath();

    // if(random.boolean()){
    context.strokeStyle = 'black';
    context.fill();
    // let shadowColor = color.offsetHSL(this.color, 0, 0, -20);
    //       shadowColor.rgba[3] = 0.5; 
    //       context.shadowColor = color.style(shadowColor.rgba);  // Add shadow color here
    //       context.shadowOffsetX = -5;
    //       context.shadowOffsetY = 5;
    // }
    context.stroke();
    context.restore();
    // implementation here
  }
};