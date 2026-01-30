const canvasSketch = require('canvas-sketch');

const settings = {
    dimensions: [600, 600],
    animate: true,
};
let w = 600;
let h = 600;
let sc = 40;
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
        // context.moveTo(-this.width / 2, 0);
        // context.arc(-this.width / 2, -this.height / 2, 10, 0, Math.PI * 2);
        context.fillRect(-this.width / 2, -this.height / 8, this.width, this.height / 4);
        // context.lineTo(this.width / 2, 0);
        // context.lineTo(0, -this.height / 2);
        // context.lineTo(0, 0);
        context.stroke();
        // context.restore();
        context.rotate(-this.ang);
        context.translate(-px, -py);
    }
}

const sketch = () => {
    let box = [];
    let pi = Math.PI / 22;
    for (let j = 0; j < sc; j++) {
        for (let i = 0; i < sc; i++) {
            let x = (w / sc - siz) / 2 + siz / 2 + i * w / sc;
            let y = (h / sc - siz) / 2 + siz / 2 + j * h / sc;
            box.push(new Box(x, y, pi * (i + 1 + j + 1)));
        }
    }
    let angle = Math.PI / 180 * 10;
    return ({ context, width, height }) => {
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        context.fillStyle = 'black';
        context.font = '48px Arial';

        // context.translate(100, 100);
        // context.beginPath();
        // context.strokeStyle = 'black';
        // context.rotate(angle);
        // context.moveTo(-50, -50);
        // context.lineTo(50, 0);
        // context.lineTo(-50, 50);
        // context.lineTo(-50, -50);
        // context.stroke();
        // context.rotate(-angle);
        // context.translate(-100, -100);
        // context.closePath();
        // // context.restore();
        context.beginPath();
        context.fillStyle = 'blue';

        context.lineWidth = 2;
        box.forEach(box => {
            box.draw(context);
        });
        context.closePath();
    };
};

canvasSketch(sketch, settings);