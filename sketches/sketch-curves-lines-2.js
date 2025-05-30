const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const colormap = require('colormap');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = ({width, height}) => {
  const cols = 78;
  const rows = 9;
  const numCells = cols * rows;

  // grid
  const gw = width * 0.8;
  const gh = height * 0.8;

  // cell
  const cw = gw / cols;
  const ch = gh / rows;

  // margin
  const mx = (width - gh) * 0.5;
  const my = (height - gw) * 0.5;

  const points = [];
  let x, y, n, lineWidth, color ;
  let frequency = 0.002;
  let amplitude = 90;

  const colors = colormap({
    colormap: 'salinity',//'magma',
    nshades: amplitude,
  })

  for(let i = 0; i < numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;

    n = random.noise2D(x, y, frequency, amplitude);
    x += n;
    y += n;

    lineWidth = math.mapRange(n, -amplitude, amplitude, 0, 5);
    
    color = colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];
    
    points.push( new Point({x, y, lineWidth, color}) );
  }
  // points.forEach((point, k)=> {console.log(k, point)});

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);
    context.translate(cw * 0.5, ch * 0.5);
    context.strokeStyle = 'red';
    context.lineWidth = 4;

    let lastx, lasty; 

    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < cols - 1; j++) {
        const curr = points[i * cols + j];
        const next = points[i * cols + j + 1];
        
        const mx = curr.x + (next.x - curr.x)*0.8;
        const my = curr.y + (next.y - curr.y)*5.5;
        
        if(!j) {
          lastx = curr.x;
          lasty = curr.y;
        }

        context.beginPath();
        context.lineWidth = curr.lineWidth;
        context.strokeStyle = curr.color;
        context.moveTo(lastx, lasty);
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
        context.stroke();

        lastx = mx - j /cols*250;
        lasty = my - i /rows * 250;
      } 
    }

    points.forEach(point => {
      // point.draw(context);
    });

    context.restore();
  };
};

canvasSketch(sketch, settings);

class Point {
  constructor({x, y, lineWidth, color}) {
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI*2);
    context.fill(); 
    context.restore();
  }
}