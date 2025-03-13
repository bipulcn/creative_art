const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
};

const sketch = ({width, height}) => {
  const agetns = [];
  for(let i = 0; i < 50; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    agetns.push(new Agent(x, y));
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for(let i = 0; i < agetns.length; i++) {
      const agent = agetns[i];
      for(let j = i+1; j < agetns.length; j++) {
        const other = agetns[j];
        const dis = agent.pos.getDistance(other.pos);
        if(dis > 300) continue;
        context.save();
        context.lineWidth = math.mapRange(dis, 0, 200, 24, 2);
        context.beginPath()
        context.strokeStyle = 'gray';
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
        context.restore();
      }
    }

    agetns.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height); 
    });
  };
};

canvasSketch(sketch, settings);


class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
  }
  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radious = random.range(10, 24);
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) {
      this.vel.x = -this.vel.x;
    }
    if (this.pos.y <= 0 || this.pos.y >= height) {
      this.vel.y = -this.vel.y;
    }
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.fillStyle = 'black';
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 4;
    context.arc(0, 0, this.radious, 0, Math.PI * 2);
    // context.fill();
    context.stroke();
    context.restore();
  }
}