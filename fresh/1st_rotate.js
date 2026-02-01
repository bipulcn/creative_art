const canvasSketch = require('canvas-sketch');

const settings = {
    dimensions: [600, 600],
    animate: true,
};
let w = 600;
let h = 600;
let sc = 10;
let siz = w / sc - 4;
class Box {
    constructor(x, y, ang) {
        this.x = x;
        this.y = y;
        this.width = siz;
        this.height = siz;
        this.ang = ang;
    }

    draw(context) {
        let px = this.x;
        let py = this.y;
        context.beginPath();
        context.translate(px, py);
        context.rotate(this.ang);
        context.fillRect(-this.width / 2, -this.height / 16, this.width, this.height / 8);
        context.stroke();
        context.rotate(-this.ang);
        context.translate(-px, -py);
    }
    update() {
        this.ang += 0.05;
    }
}

const onMouseDown = (e) => {
    console.log("working ", e);
}

const sketch = ({ canvas }) => {
    let box = [];
    let pi = Math.PI / 22;
    let angle = Math.PI / 180 * 1;
    console.log(angle * 2);
    let line = new Box(100, 100, angle * 10);
    canvas.addEventListener('mousedonw', onMouseDown);
    return ({ context, width, height }) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        context.fillStyle = 'black';
        context.font = '48px Arial';
        context.beginPath();
        line.draw(context);
        context.fillStyle = 'blue';

        context.lineWidth = 2;
        context.closePath();
    };
};

canvasSketch(sketch, settings);