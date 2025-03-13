const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 2048, 2048 ], 
  animate: true,
};

let cnvs = null;
let imgA;
let balls = [];
// const ctn = cnvs.getContext('2d');

const sketch = ({width, height, canvas}) => {
  
  const imgACanvas = document.createElement('canvas');
  const imgAContext = imgACanvas.getContext('2d');

  imgACanvas.width = imgA.width;
  imgACanvas.height = imgA.height;

  imgAContext.drawImage(imgA, 0, 0);
  const imgAData = imgAContext.getImageData(0, 0, imgA.width, imgA.height).data;

  // canvas.addEventListener('mousedown', onMouseDown);
  cnvs = canvas;
  for(let i=0; i< 100; i++){
    let x, y, ix, iy, idx, r, g, b, colA;
    for(let j=0; j< 100; j++){
      x = i*20.5;
      y = j*20.5;      
      ix = Math.floor((x / width) * imgA.width);
      iy = Math.floor((y / height) * imgA.height);
      
      idx = (iy * imgA.width + ix) * 4;
      r = imgAData[idx + 0];
      g = imgAData[idx + 1];
      b = imgAData[idx + 2];
      colA = `rgb(${r},${g},${b})`;
      const obj = new Ball({x: x, y: y, radious: 10, color: colA, width:width, height:height});
      balls.push(obj);
    }
  }
  // console.log(random.value());
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    
    balls.forEach((obj)=>{
      obj.draw(context);
    });
    context.drawImage(imgACanvas, 0, 0);
  };
};

let ob = [x=0, y=0];
const onMouseDown = (en) => {
  cnvs.addEventListener('mousemove', onMouseMove);
  cnvs.addEventListener('mouseup', onMouseUp);
  let x = en.clientX;
  let y = en.clientY;
  const rc = cnvs.getBoundingClientRect();
  const cx = (x - rc.left)/(rc.right - rc.left) * cnvs.width;
  const cy = (y - rc.top)/(rc.bottom - rc.top) * cnvs.height;
  ob.x = bx.x -cx;
  ob.y = bx.y -cy;
  if(Math.abs(ob.x)< bx.w*0.5 && Math.abs(ob.y)< bx.h*0.5)
    bx.isDragging = true;
  else bx.isDragging = false;
}
const onMouseMove = (en) => {
  let x = en.clientX;
  let y = en.clientY;
  const rc = cnvs.getBoundingClientRect();
  const cx = (x - rc.left)/(rc.right - rc.left) * cnvs.width;
  const cy = (y - rc.top)/(rc.bottom - rc.top) * cnvs.height;
  if(bx.isDragging) {
    bx.x = cx + ob.x;
    bx.y = cy + ob.y;
  }
}
const onMouseUp = (en) => {
  cnvs.removeEventListener('mousemove', onMouseMove);
  cnvs.removeEventListener('mousedown', onMouseUp);
}

const loadImage = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(img);
    img.src = url;
  })
}

const start = async () => {
  imgA = await loadImage('images/photo3.jpg');

  canvasSketch(sketch, settings);
}

start();


class Ball {
  constructor({x = 0, y = 0, radious = 100, color = 'red', width=1000, height=1000}) {
    this.x = x;
    this.y = y;
    this.radious = radious;
    this.color = color;
  }
  draw(context) {
    context.save();
    context.fillStyle = this.color;
    context.translate(this.x, this.y);
    context.beginPath();
    context.arc(0,0, this.radious, 0, Math.PI * 2);
    context.lineWidth = 8;
    context.fill();
    context.closePath();    
    context.restore();
  }
}
