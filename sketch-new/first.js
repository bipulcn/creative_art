const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 600, 400 ], // Canvas size
  animate: true // Enable animation loop
};

const sketch = () => {
  // Setup code (runs once)
  let x = 100;
  let speed = 2;
  let dirX = 1;
  let dirY = 1;

  // Return the render function
  return ({ context, width, height }) => {
    // Animation/Drawing loop code (runs repeatedly)

    // Clear
    context.fillStyle = 'white'; // White background
    context.fillRect(0, 0, width, height);

    // Update
    x += speed;
    if (x > width + 20) x = -20; // Loop circle around

    // Draw
    context.fillStyle = 'orange';
    context.beginPath();
    context.arc(x, height / 2, 20, 0, Math.PI * 2);
    context.fill();
  };
};

canvasSketch(sketch, settings);