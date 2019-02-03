const SPEED = 100;
const CANVAS_OPTIONS = {
  cols: 25,
  rows: 25,
  id: 'canvas',
  resolution: 20,
  bgColor: '#3e4444'
};

main();

function main() {
  createCanvas(CANVAS_OPTIONS);
  let intervalRef;
  document.getElementById('start').onclick = () => {
    !!intervalRef ? clearInterval(intervalRef) : 0;
    intervalRef = start(SPEED);
  };
}

function start(speed) {
  const points = document.getElementById('points');
  const snake = new Snake(document.body, CANVAS_OPTIONS);
  const food = new Food(CANVAS_OPTIONS);
  const intervalRef = setInterval(() => {
    points.textContent = (snake.tail.length -1) * 10;
    if (snake.death(snake.next())) {
      alert('You lose!');
      clearInterval(intervalRef);
      return;
    }
    snake.update();
    if (snake.eat(food.x, food.y)) {
      food.move();
    }
    draw([
      snake.show.bind(snake),
      food.draw.bind(food)
    ]);
  }, speed);
  return intervalRef;
}

function draw(cbs) {
  deleteCanvas();
  const context = createCanvas();
  cbs.forEach(cb => cb(context));
}

function Food({cols, rows, resolution}) {
  this.draw = function(context, scale = resolution) {
    context.fillStyle = '#F00';
    context.fillRect(this.x * scale, this.y * scale, scale, scale);
  }

  this.move = function() {
    this.x = Math.floor(Math.random() * cols);
    this.y = Math.floor(Math.random() * rows);
  }

  this.move();
}

function keyPressed({keyCode}, direction ) {
  if (keyCode == 38 ) { // UP
    direction(0, -1);
  } else if (keyCode == 40 ) { // DOWN
    direction(0, 1);
  } else if (keyCode == 37 ) { // LEFT
    direction(-1, 0);
  } else if (keyCode == 39 ) { // RIGHT
    direction(1, 0);
  }
}

function constrain(value, min, max) {
  if (value <= min) {
    return min;
  } else if (value >= max) {
    return max;
  }
  return value;
}

function Snake(body, {resolution, cols, rows}) {
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 1;
  this.tail = [{x:0, y:0}];

  body.onkeydown = event => keyPressed(event, this.direction.bind(this));

  this.next = function(maxX = cols, maxY = rows) {
    const x = constrain(this.tail[0].x + this.xspeed, 0, maxX - 1);
    const y = constrain(this.tail[0].y + this.yspeed, 0, maxY - 1);
    return {x, y};
  }

  this.update = function() {
    this.tail = [this.next(), ...this.tail].slice(0, this.total);
  }

  this.show = function(context, snakeColor = '#FFF', scale = resolution) {
    context.fillStyle = snakeColor;
    this.tail.forEach(point =>
      context.fillRect(point.x * scale, point.y * scale, scale, scale)
    );
  }

  this.death = function({x, y}) {
    return !!this.tail.find(point => point.x == x && point.y == y);
  }

  this.direction = function(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.eat = function(x, y) {
    if (x == this.tail[0].x && y == this.tail[0].y) {
      this.total++;
      return true;
    }
    return false;
  }
}

function createCanvas({ cols, rows, id, resolution, bgColor } = CANVAS_OPTIONS) {
  const canvas = document.createElement(id);
  canvas.width = cols * resolution;
  canvas.height = rows * resolution;
  document.body.append(canvas);
  background(canvas, bgColor);
  return context = canvas.getContext('2d');
}

function background(canvas, color) {
  const context = canvas.getContext('2d');
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function deleteCanvas({id} = CANVAS_OPTIONS) {
  !!document.querySelector(id)
    ? document.querySelector(id).remove()
    : 0;
}