const canvasSketch = require('canvas-sketch');

const settings = {
    dimensions: [2048, 2048]
}

const sketch = ({width, height}) => {
    const points = [];
    const rd = 20, ds = 3, cx=width*0.5, cy=height*0.5;
    let clr = 'green';
    points.push(new ball(width*0.5, height*0.5, rd, clr));
    for(let i=2; i<(width*0.7)/rd; i+=2) {
        let r = (rd+ds)*i;
        let ang = 360/(3*i);
        let deg = ang;
        for(let j=0; j< i*Math.PI; j++) {
            x = cx + r * Math.cos(deg * Math.PI / 180);
            y = cy + r * Math.sin(deg * Math.PI / 180);
            // let rad = rd;
            let rad = rd*(1-(i*Math.PI/250));
            // let clr = ((i+j*3)%5==0)? 'white': 'lightgreen';
            points.push(new ball(x, y, rad, clr));
            deg += ang;
        }
    }

    return ({context, width, height}) => {
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        context.fillStyle = "white";

        points.forEach((ball)=>{
            ball.draw(context);
        })
    }
}

class ball {
    constructor(x, y, radius, color="white") {
        this.x = x;
        this.y = y;
        this.rs = radius;
        this.color = color;
    }

    draw(context) {
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.rs, 0, Math.PI *2);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }
}

canvasSketch(sketch, settings);