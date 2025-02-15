const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = ({width, height}) => {
  const points = [];
  // const gSize = 60;
  // for(let i=1; i<width/gSize; i++) {
  //   for(let j=1; j< height/gSize; j++){
  //     // let radious = Math.sqrt( Math.abs(1024 - Math.sqrt(Math.abs(width*height*0.25 - i*j*gSize*gSize))));
  //     let dis =  Math.pow((width*0.5 - i*gSize), 2) + Math.pow((height*0.5 - j*gSize), 2);
  //     let radious = 22 - Math.sqrt(Math.sqrt(dis)*0.5);
  //     radious = radious >0 ? radious: 0;
  //     console.log(i, j, radious);
  //     points.push(new ball(i*gSize, j*gSize, radious*1.7));
  //   }
  // }

  const rd = 30;

  // console.log(Math.sin(0), Math.sin(30), Math.sin(45), Math.sin(60), Math.sin(90));
  // console.log(Math.sin(0*(180/Math.PI)), Math.sin(30*(180/Math.PI)), Math.sin(45*(180/Math.PI)), Math.sin(60*(180/Math.PI)), Math.sin(90*(180/Math.PI)));
  // console.log(180/Math.PI);
  
  let cx=  width*0.5, cy = height*0.5;
  points.push(new ball(cx, cy, rd));
  for(let i=2; i<(width*0.5)/rd; i+=2) {
    let r = (rd+5)*i;
    let ang = 360/(3*i);
    let deg = 0;
    for(j=0; j< i*Math.PI; j++){
      let x = cx + r * Math.cos(deg*Math.PI / 180);
      let y = cy + r * Math.sin(deg*Math.PI / 180);
      let rad = rd*(1-(i*Math.PI/100));
      rad = rad >0 ? rad: 0;
      points.push(new ball(x, y, rad));
      deg += ang;
    }
    console.log(points.length, i*Math.PI);
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';
    // const bal = new ball(width*0.8, height / 2, 20);
    // bal.draw(context);
    points.forEach((point)=>{
      point.draw(context);
    });
  };
};

class ball {
  constructor(x, y, radius, color='white') {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw(context) {
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }
}

canvasSketch(sketch, settings);
