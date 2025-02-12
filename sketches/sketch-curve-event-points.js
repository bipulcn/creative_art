const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ], 
  animate: true,
};

let elCanvas
let points;

const sketch = ({canvas}) => {
  points = [
    new Point({x:200, y:540}),
    new Point({x:500, y:300, control:true}),
    new Point({x:800, y:540}),
    new Point({x:600, y:700}),
    new Point({x:640, y:940}),
  ]

  canvas.addEventListener('mousedown', onMouseDown);
  elCanvas = canvas;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = '#999';
    context.beginPath();

    context.moveTo(points[0].x, points[0].y);
    points.forEach(point => {
      context.lineTo(point.x, point.y);
    });
    context.stroke();
    
    // for(let i=1; i<points.length; i+=2){
    //   context.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
    // }
    // context.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
    // context.quadraticCurveTo(points[3].x, points[3].y, points[4].x, points[4].y);
    // context.stroke();

    context.beginPath();
    for(let i=0; i<points.length-1; i++){
      const curr = points[i];
      const next = points[i+1];
      const mx = curr.x + (next.x - curr.x)*0.5;
      const my = curr.y + (next.y - curr.y)*0.5;
      
      context.beginPath();
      context.arc(mx, my, 5, 0, Math.PI*2);
      context.fillStyle = '#0AF';
      context.fill();
    }
    context.beginPath();
    
    for(let i=0; i<points.length-1; i++){
      const curr = points[i];
      const next = points[i+1];
      const mx = curr.x + (next.x - curr.x)*0.5;
      const my = curr.y + (next.y - curr.y)*0.5;
      
      // context.beginPath();
      // context.arc(mx, my, 5, 0, Math.PI*2);
      // context.fillStyle = '#0AF';
      // context.fill();
      // if(i==0) context.moveTo(mx, my);
      if(i==0) context.moveTo(curr.x, curr.y);
      else if(i==points.length-2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y );
      else context.quadraticCurveTo(curr.x, curr.y, mx, my);
    }
    context.lineWidth = 4;
    context.strokeStyle = 'orange';
    context.stroke();

    points.forEach(point => {
      point.draw(context);
    });
  };
};

const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  let hit = false;
  points.forEach(point =>{
    point.isDragging = point.hitTest(x, y);
    if (!hit && point.isDragging) hit = true;
  })

  if(!hit) points.push(new Point({x, y}));
}

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;
  points.forEach(point =>{
    if(point.isDragging) {
      point.x = x;
      point.y = y;
    }
  })
}
const onMouseUp = (e) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
}


canvasSketch(sketch, settings);

class Point{
  constructor({x, y, control=false}){
    this.x = x;
    this.y = y;
    this.control = control;
  }

  draw(context){
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? 'red': 'black';
    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI*2);
    context.fill();
    context.restore();
  }

  hitTest(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 20;
  }
}
