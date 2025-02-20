const canvasSketch = require("canvas-sketch");
const Random = require("canvas-sketch-util/random");
const { linspace } = require("canvas-sketch-util/math");
const palettes = require("nice-color-palettes");

const defaultSeed = "";
Random.setSeed(defaultSeed || Random.getRandomSeed());
// console.log("Random Seed:", Random.getSeed());

const settings = {
  hotkeys: false,
  suffix: Random.getSeed(),
  // animate: true,
  dimensions: [2048, 2048]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    const draw = (x, y, width, height) => {
      const leftToRight = Random.value() >= 0.5;

      if (leftToRight) {
        context.moveTo(x, y);
        context.lineTo(x + width, y + height);
      } else {
        context.moveTo(x + width, y);
        context.lineTo(x, y + height);
      }
    };

    context.lineCap = "square";
    context.lineWidth = width * 0.003;

    const step = width * 0.02;

    context.beginPath();

    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        draw(x, y, step, step);
      }
    }

    context.stroke();
  };
};

canvasSketch(sketch, settings);
