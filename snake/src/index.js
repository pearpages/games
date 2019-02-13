import { CANVAS } from './canvas';
import { FOOD } from './food';
import { INPUT } from './input';
import { SNAKE } from './snake';
import { SOUND } from './sound';
import CANVAS_OPTIONS from './config.json';

let state = {};

const START_BUTTON = {
  get: function () {
    return document.getElementById('start');
  }
}

const POINTS = {
  get: function () {
    return document.getElementById('points');
  },

  update: function (snakeTailLength, initialSnakeLength) {
    this.get().textContent = (snakeTailLength - initialSnakeLength) * 10;
  }
}

const GAME = {
  getInitialState: function () {
    const snake = SNAKE.initialState();
    return {
      snake,
      food: FOOD.move(CANVAS_OPTIONS, snake.tail),
      gameRef: null,
      startButton: null,
      points: null,
      paused: false
    };
  },

  hasStarted: () => !!state.gameRef,

  isPaused: () => state.isPaused,

  endGame: function () {
    !!state.gameRef ? clearInterval(state.gameRef) : 0;
  },

  isStarting: function (key) {
    return key === INPUT.keys.ENTER;
  },

  isPausing: function (key) {
    return key === INPUT.keys.SPACE;
  },

  init: function () {
    document.body.ontouchstart = event => {
      const canvas = document.querySelector('canvas');
      const {offsetHeight, offsetLeft} = canvas;
      let snakeHead;
      if (state.snake && state.snake.tail) {
        snakeHead = {
          x: (state.snake.tail[0].x * CANVAS_OPTIONS.resolution) + offsetLeft,
          y: (state.snake.tail[0].y * CANVAS_OPTIONS.resolution) + offsetHeight
        };
        const touch = {x: event.touches[0].pageX, y: event.touches[0].pageY};
        const swhitchHorizontally = (touch, snakeHead) => {
          if (touch.x < snakeHead.x ) {
            state.snake = { ...SNAKE.updateSpeed(INPUT.keys.LEFT, state.snake) };
          } else {
            state.snake = { ...SNAKE.updateSpeed(INPUT.keys.RIGHT, state.snake) };
          }
        };
        const switchVertically = (touch, snakeHead) => {
          if (touch.y < snakeHead.y ) {
            state.snake = { ...SNAKE.updateSpeed(INPUT.keys.UP, state.snake) };
          } else {
            state.snake = { ...SNAKE.updateSpeed(INPUT.keys.DOWN, state.snake) };
          }
        };
        if (SNAKE.isGoingUp(state.snake)) {
          swhitchHorizontally(touch, snakeHead);
        } else if (SNAKE.isGoingDown(state.snake)) {
          swhitchHorizontally(touch, snakeHead);
        } else if (SNAKE.isGoingLeft(state.snake)) {
          switchVertically(touch, snakeHead);
        } else if (SNAKE.isGoingRight(state.snake)) {
          switchVertically(touch, snakeHead);
        }
      }
    };
    document.body.onkeydown = event => {
      const keyPressed = INPUT.keyPressed(event.keyCode);
      if (GAME.isStarting(keyPressed)) {
        GAME.start();
      } else if (GAME.isPausing(keyPressed)) {
        GAME.isPaused()
          ? (GAME.start(state), state.isPaused = false)
          : (GAME.endGame(), state.isPaused = true);
      } else if (GAME.hasStarted() && !GAME.isPaused() && SNAKE.isMoving(keyPressed)) {
        state.snake = { ...SNAKE.updateSpeed(INPUT.keyPressed(event.keyCode), state.snake) };
      }
    };
  },

  start: function (initialState = this.getInitialState()) {
    GAME.endGame();
    state = { ...initialState };
    state.gameRef = this.runGame(CANVAS_OPTIONS);
  },

  paintFrame: (elementsToDraw, canvasOptions) => setInterval(() => {
    POINTS.update(state.snake.tail.length, state.snake.initialLength);
    if (SNAKE.death(canvasOptions, state.snake)) {
      SOUND.chord();
      GAME.endGame();
      CANVAS.draw([CANVAS.background('red'), ...elementsToDraw.slice(1)]);
      state = { ...GAME.getInitialState() };
      return;
    }
    if (SNAKE.eat(state.food, state.snake.tail)) {
      SOUND.beep();
      state.snake.total++;
      state.food = FOOD.move(canvasOptions, state.snake.tail);
    }
    state.snake = { ...SNAKE.update(canvasOptions, state.snake) };
    CANVAS.draw(elementsToDraw);
  }, canvasOptions.speed),

  runGame: function (canvasOptions) {
    const elementsToDraw = [
      CANVAS.background(CANVAS_OPTIONS.bgColor),
      (context) => SNAKE.draw(context, canvasOptions.resolution, state.snake.tail),
      (context) => FOOD.draw(canvasOptions.resolution, state.food, context)
    ];

    return this.paintFrame(elementsToDraw, canvasOptions);
  }
}

function main() {
  CANVAS.createCanvas();
  CANVAS.draw([CANVAS.background(CANVAS_OPTIONS.bgColor)]);
  GAME.init();
  START_BUTTON.get().onclick = () => GAME.start();
}

main();