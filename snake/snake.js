function constrain(value, min, max) {
  if (value <= min) {
    return min;
  } else if (value >= max) {
    return max;
  }
  return value;
}

function Snake() {}
Snake.death = function (canvasOptions, snake) {
  const {x, y} = Snake.next(canvasOptions, snake);
  return !!snake.tail.find(point => point.x == x && point.y == y);
}

Snake.eat = function ({x, y}, tail) {
  if (x == tail[0].x && y == tail[0].y) {
    return true;
  }
  return false;
}

Snake.draw = function (context, scale, tail) {
  const snakeColor = '#FFF'
  context.fillStyle = snakeColor;
  tail.forEach(point =>
    context.fillRect(point.x * scale, point.y * scale, scale, scale)
  );
};

Snake.next = function ({cols, rows}, snake) {
  const x = constrain(snake.tail[0].x + snake.xspeed, 0, cols - 1);
  const y = constrain(snake.tail[0].y + snake.yspeed, 0, rows - 1);
  return { x, y };
}

Snake.update = function ({cols, rows}, snake) {
  return {
    ...snake,
    tail: [Snake.next({cols, rows}, snake), ...snake.tail].slice(0, snake.total)
  }
};
