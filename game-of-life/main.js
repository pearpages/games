const resolution = 5;

main();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function make2DArray({cols, rows}, random = true) {
  return [...Array(cols)].map(
    _ => [...Array(rows)].map(
      _ => !!random ? getRandomInt(0, 2) :undefined
    )
  )
}

function loop(grid, cb) {
  const newArguments = [...arguments].slice(2);
  grid.forEach((row, x) => row.forEach((_, y) => cb(x, y, grid, ...newArguments)));
}

function draw(x, y, grid, canvas) {
  !!(grid[x][y])
    ? (canvas.fillStyle = "#000", canvas.fillRect(x * resolution, y * resolution, resolution, resolution))
    : (canvas.fillStyle = "#FFF", canvas.fillRect(x * resolution, y * resolution, resolution, resolution))
}

function createCanvas({cols, rows}, id = 'canvas') {
  const canvas = document.createElement(id);
  canvas.width = cols * resolution;
  canvas.height = rows * resolution;
  document.body.append(canvas);
  return context = canvas.getContext('2d');
}

function countNeighbors(x, y, grid, {cols, rows}) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const a = (x + i + cols) % cols;
      const b = (y + j + rows) % rows;
      sum += grid[a][b];
    }
  }
  return sum - grid[x][y];
}

function rules(current, next) {
  if (current == 0 && next == 3) {
    return 1;
  } else if (current == 1 && (next < 2 || next > 3)) {
    return 0;
  } else {
    return current;
  }
}

function fillNext(x, y, grid, next, size) {
  next[x][y] = rules(grid[x][y], countNeighbors(x, y, grid, size));
}

function deleteCanvas(id = 'canvas') {
  document.querySelector(id).remove();
}

function iterate(currentGrid, nextGrid, iterations, params) {
  return setInterval(() => {
    iterations.textContent = parseInt(iterations.textContent) + 1;
    deleteCanvas();
    const canvas = createCanvas(params);
    loop(currentGrid, fillNext, nextGrid, params);
    loop(nextGrid, draw, canvas);
    let temp = currentGrid;
    currentGrid = nextGrid;
    nextGrid = temp;
  }, params.speed);
}

function main() {
  let intervalRef;
  let currentGrid;
  let nextGrid;
  let canvas;
  let params;
  const cols = document.getElementsByName('cols')[0];
  const rows = document.getElementsByName('rows')[0];
  const speed = document.getElementsByName('speed')[0];
  const iterations = document.getElementById('iterations');
  const reloadButton = document.getElementById('reload');
  const pauseContinue = document.getElementById('pause')

  function start() {
    params = {
      cols: parseInt(cols.value),
      rows: parseInt(rows.value),
      speed: parseInt(speed.value)
    };
    currentGrid = make2DArray(params);
    nextGrid = make2DArray(params, false);
    canvas = createCanvas(params);
    loop(currentGrid, draw, canvas);
    intervalRef = iterate(currentGrid, nextGrid, iterations, params);
  }

  reloadButton.onclick = () => location.reload();
  pauseContinue.onclick = event => {
      const target = event.target;
      if (target.textContent == 'Start') {
        start();
        target.textContent = 'Pause';
      } else if (target.textContent == 'Pause') {
        clearInterval(intervalRef);
        target.textContent = 'Continue';
      } else {
        target.textContent = 'Pause';
        intervalRef = iterate(currentGrid, nextGrid, iterations, params);
      }
    }
}
