const SPEED = 100;
const CANVAS_OPTIONS = {
  cols: 25,
  rows: 25,
  id: 'canvas',
  resolution: 20,
  bgColor: '#3e4444'
};
const initialState = {
  food: {x: 0, y: 0},
  snake: {
    xspeed: 1,
    yspeed: 0,
    total: 1,
    tail: [{ x: 0, y: 0 }]
  }
};
let state;

main();

function main() {
  createCanvas(CANVAS_OPTIONS);
  let intervalRef;
  document.getElementById('start').onclick = () => {
    state = {...initialState};
    !!intervalRef ? clearInterval(intervalRef) : 0;
    intervalRef = start(SPEED);
  };
}

function start(speed) {
  const points = document.getElementById('points');

  document.body.onkeydown = event => keyPressed(event, (x, y) => {
    state.snake.xspeed = x;
    state.snake.yspeed = y;
  });
  state.food = Food.move(CANVAS_OPTIONS);

  const intervalRef = setInterval(() => {
    points.textContent = (state.snake.tail.length -1) * 10;
    if (Snake.death(CANVAS_OPTIONS, state.snake)) {
      chord();
      alert('You lose!');
      clearInterval(intervalRef);
      return;
    }
    state.snake = {...Snake.update(CANVAS_OPTIONS, state.snake)};
    if (Snake.eat(state.food, state.snake.tail)) {
      state.snake.total++;
      beep();
      state.food = Food.move(CANVAS_OPTIONS);
    }
    draw([
      (context) => Snake.draw(context, CANVAS_OPTIONS.resolution, state.snake.tail),
      (context) => Food.draw(CANVAS_OPTIONS.resolution, state.food, context)
    ]);
  }, speed);
  return intervalRef;
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
