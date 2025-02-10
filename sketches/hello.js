const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  let x, y, w, h;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';    
    context.fillRect(0, 0, width, height);
    
    console.log("why not working");
  };
};

canvasSketch(sketch, settings);
