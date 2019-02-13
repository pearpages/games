import { INPUT } from './input';

export const SNAKE = function () {
    return {
      death,
      eat,
      draw,
      next,
      update,
      updateSpeed,
      isMoving,
      isGoingLeft,
      isGoingRight,
      isGoingUp,
      isGoingDown,
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

    function isGoingLeft(snake) {
      return snake.xspeed === -1;
    }

    function isGoingRight(snake) {
      return snake.xspeed === 1;
    }

    function isGoingUp(snake) {
      return snake.yspeed === -1;
    }

    function isGoingDown(snake) {
      return snake.yspeed === 1;
    }

    function updateSpeed(keyPressed, snakeState) {
      if ((keyPressed === INPUT.keys.UP) &&
        snakeState.yspeed !== 1) {
        return {
          ...snakeState,
          xspeed: 0,
          yspeed: -1
        };
      } else if ((keyPressed === INPUT.keys.DOWN) &&
        snakeState.yspeed !== -1) {
        return {
          ...snakeState,
          xspeed: 0,
          yspeed: 1
        };
      } else if ((keyPressed === INPUT.keys.LEFT) &&
        snakeState.xspeed !== 1) {
        return {
          ...snakeState,
          xspeed: -1,
          yspeed: 0
        };
      } else if ((keyPressed === INPUT.keys.RIGHT) &&
        snakeState.xspeed !== -1) {
        return {
          ...snakeState,
          xspeed: 1,
          yspeed: 0
        };
      } else {
        return snakeState;
      }
    }

    function death(canvasOptions, snake) {
      const { x, y } = next(canvasOptions, snake);
      return !!snake.tail.find(point => point.x == x && point.y == y);
    }

    function eat({ x, y }, tail) {
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

    function next({ cols, rows }, snake) {
      const x = constrain(snake.tail[0].x + snake.xspeed, 0, cols - 1);
      const y = constrain(snake.tail[0].y + snake.yspeed, 0, rows - 1);
      return { x, y };
    }

    function update({ cols, rows }, snake) {
      return {
        ...snake,
        tail: [next({ cols, rows }, snake), ...snake.tail].slice(0, snake.total)
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