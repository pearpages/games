const CANVAS_OPTIONS = {
  cols: 25,
  rows: 25,
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

const FOOD = {
  draw: function(scale, {x, y}, context) {
    context.fillStyle = '#F00';
    context.fillRect(x * scale, y * scale, scale, scale);
  },

  move: function({cols, rows}, tail) {
    function getX(notValidXs = tail.map(p => p.x), max = cols) {
      return nextValue(notValidXs, max);
    }

    function getY(notValidYs = tail.map(p => p.y), max = rows) {
      return nextValue(notValidYs, max);
    }

    function nextValue(notValids, max) {
      const nextCanidate = max => Math.floor(Math.random() * max);
      let foundNext = false;
      let candidate;
      while(!foundNext) {
        candidate = nextCanidate(max);
        foundNext = !notValids.includes(candidate);
        return candidate;
      }
    }

    return {
      x: getX(),
      y: getY()
    }
  }
};

const INPUT = {
  keys: {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    SPACE: 'SPACE',
    ENTER: 'ENTER'
  },
  keyPressed: function (keyCode) {
    if (keyCode == 38 ) {
      return this.keys.UP;
    } else if (keyCode == 40 ) {
      return this.keys.DOWN;
    } else if (keyCode == 37 ) {
      return this.keys.LEFT;
    } else if (keyCode == 39 ) {
      return this.keys.RIGHT;
    } else if (keyCode == 32) {
      return this.keys.SPACE;
    } else if (keyCode == 13) {
      return this.keys.ENTER;
    }
  },
  isKeyCode: (keyCode, key) => INPUT.keyPressed(keyCode) ===  key
};

const SNAKE = function () {
  return {
    death,
    eat,
    draw,
    next,
    update,
    updateSpeed,
    isMoving,
    initialState
  };

  function initialState() {
    return {
      xspeed: 1,
      yspeed: 0,
      initialLength: 3,
      total: 3,
      tail: [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }]
    };
  }

  function isMoving(key) {
    const moving = [
      INPUT.keys.UP,
      INPUT.keys.DOWN,
      INPUT.keys.LEFT,
      INPUT.keys.RIGHT,
    ];

    return moving.includes(key);
  }

  function updateSpeed(keyCode, snakeState) {
    if (INPUT.isKeyCode(keyCode, INPUT.keys.UP)) {
      return {
        ...snakeState,
        xspeed: 0,
        yspeed: -1
      };
    } else if (INPUT.isKeyCode(keyCode, INPUT.keys.DOWN)) {
      return {
        ...snakeState,
        xspeed: 0,
        yspeed: 1
      };
    } else if (INPUT.isKeyCode(keyCode, INPUT.keys.LEFT)) {
      return {
        ...snakeState,
        xspeed: -1,
        yspeed: 0
      };
    } else if (INPUT.isKeyCode(keyCode, INPUT.keys.RIGHT)) {
      return {
        ...snakeState,
        xspeed: 1,
        yspeed: 0
      };
    } else {
      return snakeState;
    }
  }

  function death (canvasOptions, snake) {
    const {x, y} = next(canvasOptions, snake);
    return !!snake.tail.find(point => point.x == x && point.y == y);
  }

  function eat({x, y}, tail) {
    if (x == tail[0].x && y == tail[0].y) {
      return true;
    }
    return false;
  }

  function draw(context, scale, tail) {
    tail.forEach((point, i) => i === 0
      ? (context.fillStyle = '#00ff00', context.fillRect(point.x * scale, point.y * scale, scale, scale))
      : (context.fillStyle = '#FFF', context.fillRect(point.x * scale, point.y * scale, scale, scale))
    );
  };

  function next({cols, rows}, snake) {
    const x = constrain(snake.tail[0].x + snake.xspeed, 0, cols - 1);
    const y = constrain(snake.tail[0].y + snake.yspeed, 0, rows - 1);
    return { x, y };
  }

  function update({cols, rows}, snake) {
    return {
      ...snake,
      tail: [next({cols, rows}, snake), ...snake.tail].slice(0, snake.total)
    }
  };

  function constrain(value, min, max) {
    if (value <= min) {
      return min;
    } else if (value >= max) {
      return max;
    }
    return value;
  }
}();

const START_BUTTON = {
  get: function () {
    return document.getElementById('start');
  }
}

const POINTS = {
  get: function () {
    return document.getElementById('points');
  },

  update: function(snakeTailLength, initialSnakeLength) {
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

  endGame: function() {
    !!state.gameRef ? clearInterval(state.gameRef) : 0;
  },

  isStarting: function(key) {
    return key === INPUT.keys.ENTER;
  },

  isPausing: function (key) {
    return key === INPUT.keys.SPACE;
  },

  init: function () {
    document.body.onkeydown = event => {
      const keyPressed = INPUT.keyPressed(event.keyCode);
      if (GAME.isStarting(keyPressed)) {
        GAME.start();
      } else if (GAME.isPausing(keyPressed)) {
        !!state.isPaused
          ? (GAME.start(state), state.isPaused = false)
          : (GAME.endGame(), state.isPaused = true);
      } else if (SNAKE.isMoving(keyPressed)) {
        state.snake = {...SNAKE.updateSpeed(event.keyCode, state.snake)};
      }
    };
  },

  start: function (initialState = this.getInitialState()) {
    GAME.endGame();
    state = {...initialState};
    state.gameRef = this.runGame(CANVAS_OPTIONS);
  },

  paintFrame: (elementsToDraw, canvasOptions) => setInterval(() => {
    POINTS.update(state.snake.tail.length, state.snake.initialLength);
    if (SNAKE.death(canvasOptions, state.snake)) {
      chord();
      GAME.endGame();
      CANVAS.draw(
        elementsToDraw,
        {...CANVAS_OPTIONS, bgColor: 'red'});
      state = {...GAME.getInitialState()};
      return;
    }
    if (SNAKE.eat(state.food, state.snake.tail)) {
      beep();
      state.snake.total++;
      state.food = FOOD.move(canvasOptions, state.snake.tail);
    }
    state.snake = {...SNAKE.update(canvasOptions, state.snake)};
    CANVAS.draw(elementsToDraw);
  }, canvasOptions.speed),

  runGame: function (canvasOptions) {
    const elementsToDraw = [
      (context) => SNAKE.draw(context, canvasOptions.resolution, state.snake.tail),
      (context) => FOOD.draw(canvasOptions.resolution, state.food, context)
    ];

    return this.paintFrame(elementsToDraw, canvasOptions);
  }
}

function main() {
  CANVAS.createCanvas(CANVAS_OPTIONS);
  GAME.init();
  START_BUTTON.get().onclick = () => GAME.start();
}

main();