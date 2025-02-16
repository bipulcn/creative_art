const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1024, 1024 ]
};


const sketch = ({width, height}) => {
  let hand = 24;
  let deg = math.degToRad(360/hand);
  const cx = width *0.5; 
  const cy = height *0.5;
  const w = width * 0.1;
  const h = height * 0.01;
  let x, y;
  const radius = width*0.35;
  
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    // context.beginPath();
    // context.moveTo(0, height*0.5);
    // context.lineTo(width, height*0.5);
    // context.stroke();
    // context.moveTo(width*0.5, 0);
    // context.lineTo(width*0.5, height);
    // context.stroke();


    for(let i = 0; i < hand; i++){
      const angle = i * deg;
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.scale(random.range(0.9, 1.1),random.range(1, 3));
      context.beginPath();
      context.rect(-w*0.5, random.range(0, -h*0.5), random.range(w*0.2, w), random.range(h*0.2, h*2));
      context.fill();
      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);
      context.lineWidth = random.range(5, 20);
      context.beginPath();
      context.arc(0, 0, radius*random.range(0.7, 1.3), -hand*random.range(0.01, -0.8), hand* random.range(0.01, 0.5));
      context.stroke();
      context.restore();
    }
    // deg++;
    // if(deg > 360) deg = 0;
  };
};

canvasSketch(sketch, settings);
