const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const x = 100, y = 100, w = h = 160, g = 30;


    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let nx = w + g;
        context.strokeStyle = 'black';
        
        context.lineWidth = 6;
        if (Math.random() < 0.5){
          context.beginPath();
          context.rect(x + i * nx + 16, y + j * nx + 16, w - 32, h - 32);
          context.stroke();
        }
        else {
          context.beginPath();
          context.arc(x + i * nx + w*0.5, y + j * nx + h*0.5, w*0.4, 0, Math.PI * 2);
          context.stroke();
        }
        context.beginPath();
        context.rect(x + i * nx, y + j * nx, w, h);
        context.stroke();
      }
    }
  };
};

canvasSketch(sketch, settings);
