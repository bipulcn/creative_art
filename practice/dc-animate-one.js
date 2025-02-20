const canvasSketch = require('canvas-sketch');

/*

Animated Sketches
To make animated artworks, specify { animate: true } in your settings parameter. This starts a requestAnimationFrame loop once your sketch is loaded.

Now in renderer function, you can use the following props to determine how to draw your content:

time      - the current time of the loop in seconds
playhead  - the current playhead of the loop in 0..1 range (only defined when there is a fixed loop duration)
frame     - the current frame index of the animation

https://github.com/mattdesl/canvas-sketch/blob/master/docs/api.md
*/


const settings = {  
  // Enable an animation loop
  animate: true,
  // Set loop duration to 3
  duration: 5,
  // Use a small size for better GIF file size
  dimensions: [ 512, 512 ],
  // Optionally specify a frame rate, defaults to 30
  fps: 30
};

const sketch = () => {
  return ({ context, width, height, playhead }) => {
    context.fillStyle = 'orange';
    context.fillRect(0, 0, width, height);
     // Get a seamless 0..1 value for our loop
     console.log(playhead);
     const t = Math.sin(playhead * Math.PI);

     const thickness = Math.max(5, Math.pow(t, 0.55) * width * 0.5);
     // Animate the thickness with 'playhead' prop
 
     // Rotate with PI to create a seamless animation
     const rotation = playhead * Math.PI;
 
     // Draw a rotating white rectangle around the center
     const cx = width / 2;
     const cy = height / 2;
     const length = height * 0.5;
     context.fillStyle = 'white';
     context.save();
     context.translate(cx, cy);
     context.rotate(rotation);
     context.fillRect(-thickness / 2, -length / 2, thickness, length);
     context.restore();
  };
};

canvasSketch(sketch, settings);
