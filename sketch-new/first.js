const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 600, 400 ], // Canvas size
  animate: true // Enable animation loop
};

const sketch = () => {
  // Setup code (runs once)
  let x = 100;
  let y = 100;
  let speed = 8;
  let dirX = Math.random();
  let dirY = Math.random();

  // Return the render function
  return ({ context, width, height }) => {
    // Animation/Drawing loop code (runs repeatedly)

    // Clear
    context.fillStyle = 'white'; // White background
    context.fillRect(0, 0, width, height);

    // Update
    if (x > width - 20 || x < 0 + 20) dirX *= -1;
    if (y > height - 20|| y < 0 + 20) dirY *= -1;
    x += speed * dirX;
    y += speed * dirY;

    // Draw
    context.fillStyle = 'orange';
    context.beginPath();
    context.arc(x, y, 20, 0, Math.PI * 2);
    context.fill();
  };
};

canvasSketch(sketch, settings);