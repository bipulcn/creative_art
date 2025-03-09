const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);


    const grid = new grids({width: width, height: height});
    grid.draw(context);

    context.save();
    context.beginPath();
    context.lineWidth = 1;
    context.arc(width*0.5, width*0.5, 500, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.stroke();
    context.closePath();
    context.restore();

    const obj = new drawShape({x: width*0.5, y: height*0.5, radious: 500, side:8, color: 'blue'});
    obj.draw(context);


  };
};



canvasSketch(sketch, settings);

class drawShape {
  constructor({x = 0, y=0, radious = 100, side = 3, color = 'red'}) {
    this.x = x;
    this.y = y;
    this.radious = radious;
    this.color = color;
    this.side = side;
  }
  draw(context) {
    context.lineWidth = 5;
    context.save();
    context.beginPath();
    let ang = Math.PI * 2 / this.side;
    for(let i = 0; i < this.side; i++) {
      let evn = (this.side % 2==0)? 1: 2;
      let nang = ang * i  - Math.PI*(0.5 - evn/this.side);
      let x = this.x + Math.cos(nang) * this.radious;
      let y = this.y + Math.sin(nang) * this.radious;
      context.lineTo(x, y);
    }
    context.strokeStyle = this.color;
    context.closePath()
    context.stroke();
    context.restore();
    
    // context.beginPath();
    // context.save();
    // context.arc(this.x + this.radious, this.y, 10, 0, Math.PI * 2);
    // context.fillStyle = this.color;
    // context.stroke();
    // context.restore();
  }
}

class grids {
  constructor({width= 1000, height= 1000}) {
    this.w = width;
    this.h = height;
  }
  draw(context) {
    context.save();
    context.lineWidth = 0.25;
    context.strokeStyle = 'black';
    for (let i = 0; i < this.w; i += 50) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, this.h);
        context.stroke();
    }
    for (let i = 0; i < this.h; i += 50) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(this.w, i);
        context.stroke();
    }
    context.restore();
  }
}