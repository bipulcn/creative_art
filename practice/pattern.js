const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const riso = require('riso-colors');
const colormap = require('colormap');
const color = require('canvas-sketch-util/color');

const settings = {
  dimensions: [2048, 2048],
  // animate: true
};

const sketch = ({ width, height }) => {
  // let objects = patern1({ width, height, r: 100, gap: -55 });
  let objects = patern2({ width, height, side:3, r: 50, gap: -22, angle: 30 });
  return ({ context, width, height }) => {
    let gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "rgb(203, 204, 201)");
        gradient.addColorStop(1, "rgb(173, 173, 173)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    objects.forEach(obj => {
      obj.draw(context);
      if(obj.update)
        obj.update();
    });
  };
};

function patern1({ width, height, r, gap }) {
  let circles = [];
  let xn = Math.floor(width / (r * 2 + gap));
  let yn = Math.floor(height / (r * 2 + gap));
  let clrs = colormap({colormap:'cool', nshades: width*0.5});  //   'bone', 'spring', 'summer', 'autumn', 'winter', 'cool', 'hot', 'copper' 'viridis', 'plasma', 'inferno', 'magma', hsv, 'rainbow', jet | 
  // console.log(clrs);
  for (let i = 0; i < xn+1; i++) {
    for (let j = 0; j < yn+1; j++) {
      let x = (i+0.5) * (r*2 + gap);
      let y = (j+0.5) * (r*2 + gap);
      let ky = Math.floor(Math.sqrt((Math.pow(width*0.5 - x, 2) + Math.pow(height*0.5 -y, 2))/2)*2); 
      let clr = clrs[Math.floor(ky%width*0.5)];
      clr += "99";
      // let rgba = color.hexToRGBA(clr);
      // rgba[3] = 0.75;
      let circle = new Circle(x, y, r, clr, ky.toString());
      circles.push(circle);
    }
  }
  return circles;
}
function patern2({ width, height, side, r, gap, angle }) {
  let circles = [];
  let xn = Math.floor(width / (r*2 + gap));
  let yn = Math.floor(height / (r*2 + gap));
  let clrs = colormap({colormap:'summer', nshades: width*0.5});  //   'bone', 'spring', 'summer', 'autumn', 'winter', 'cool', 'hot', 'copper' 'viridis', 'plasma', 'inferno', 'magma', hsv, 'rainbow', jet | 
  for (let i = 0; i < xn; i++) {
    for (let j = 0; j < yn; j++) {
      let x = (i+0.5) * (r*2 + gap);
      let y = (j+0.5) * (r*2 + gap);
      let ky = Math.floor(Math.sqrt((Math.pow(width*0.5 - x, 2) + Math.pow(height*0.5 -y, 2))/2)*2); 
      let clr = clrs[Math.floor(ky%width*0.5)];
      clr += "99";
      let circle = new Shape(x, y, r, side, clr, angle);
      circles.push(circle);
    }
  }
  return circles;
}

canvasSketch(sketch, settings);

class Arcs {
  constructor(x, y, radius, numArcs) {
    // position
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.numArcs = numArcs;
  }
  draw(context) {
    context.beginPath();
    context.lineWidth = 10;
    context.arc(this.x, this.y, this.radius, -0.25 * Math.PI, 0 * Math.PI);
    context.fillStyle = 'red';
    context.stroke();
    // context.fill();
  }
}

class Circle {
  constructor(x, y, radius, color, txt) {
    // position
    this.x = x;
    this.y = y;
    this.radius = radius;
    if(color == null) color = '#00ED93';
    this.color = color;
    this.text = txt;
  }
  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = this.radius * 0.1;
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.stroke();
    // context.textAlign = 'center';
    // context.textBaseline = 'middle';
    // context.font = "48px serif";
    // context.fillStyle = "black";
    // context.fillText(this.text, this.x, this.y);
  }
}

class Shape {
  constructor(x, y, radius, sides, color, angle=0) {
    // position
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sides = sides;
    this.angle = angle;
    this.color = color;
  }

  update() {
    this.angle += 0.5;
    this.angle %= 360;
  }
  draw(context) {
    let ang = 360 / this.sides;
    context.save();
    // context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.lineWidth = 1;
    context.translate(this.x, this.y);
    context.beginPath();
    context.rotate(math.degToRad(this.angle));

    for (let i = 0; i < this.sides; i++) {
      let red = math.degToRad(ang * i);
      let x = this.radius * Math.cos(red);
      let y = this.radius * Math.sin(red);
      context.lineTo(x, y);
    }
    context.closePath();
    context.strokeStyle = 'black';
    context.fill();
    context.stroke();
    context.restore();
  }
};