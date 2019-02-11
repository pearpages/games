const CANVAS_OPTIONS = {
  cols: 12,
  rows: 12,
  id: 'canvas',
  resolution: 20,
  bgColor: '#3e4444',
  speed: 100
};
let state = {};

const CANVAS = {
  createCanvas: function ({ cols, rows, id, resolution, bgColor } = CANVAS_OPTIONS) {
    const canvas = document.createElement(id);
    canvas.width = cols * resolution;
    canvas.height = rows * resolution;
    document.body.append(canvas);
    this.background(canvas, bgColor);
    return context = canvas.getContext('2d');
  },

  background: function (canvas, color) {
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  },

  deleteCanvas: function ({ id } = CANVAS_OPTIONS) {
    !!document.querySelector(id)
      ? document.querySelector(id).remove()
      : 0;
  },

  draw: function (cbs, canvasOptions = CANVAS_OPTIONS) {
    this.deleteCanvas();
    const context = this.createCanvas(canvasOptions);
    cbs.forEach(cb => cb(context));
  }

};

const BALL = {
  draw: (context, x) => {
    const radius = CANVAS_OPTIONS.resolution / 2;
    context.beginPath();
    const finalX = (x * CANVAS_OPTIONS.resolution) + radius;
    const finalY = ((CANVAS_OPTIONS.rows / 2) * CANVAS_OPTIONS.resolution);
    context.arc(finalX, finalY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
  }
};

function main() {
  CANVAS.createCanvas();
  let x = 0;
  let xSpeed = 1;
  setInterval(() => {
    if (x === (CANVAS_OPTIONS.cols - 1) || (x === 0 && xSpeed < 0)) {
      xSpeed = xSpeed * -1;
    }
    CANVAS.draw([context => BALL.draw(context, x)])
    x += xSpeed;
  },
  100);
}

main();