function Food() {}
Food.draw = function(scale, {x, y}, context) {
  context.fillStyle = '#F00';
  context.fillRect(x * scale, y * scale, scale, scale);
}
Food.move = function({cols, rows}) {
  return {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  }
}