import { CHARS } from "./models.mjs";
import { Player } from "./actors/Player.mjs";
import { Coin } from "./actors/Coin.mjs";
import { Lava } from "./actors/Lava.mjs";
import { Vector } from "./Vector.mjs";

const LEVEL_CHARS = {
  [CHARS.EMPTY]: "empty",
  [CHARS.WALL]: "wall",
  [CHARS.LAVA_STATIC]: "lava",
  [CHARS.PLAYER]: Player,
  [CHARS.COIN]: Coin,
  [CHARS.LAVA_HORIZONTAL]: Lava,
  [CHARS.LAVA_VERTICAL]: Lava,
  [CHARS.LAVA_DRIPPING]: Lava
};

function createRows(tempRows, startActors) {
  const getType = char => LEVEL_CHARS[char];
  const isActor = type => typeof type != "string";
  return tempRows.map((row, yPosition) => {
    return row.map((char, xPosition) => {
      const type = getType(char);
      if (isActor(type)) {
        startActors.push(type.create(new Vector(xPosition, yPosition), char));
        return "empty";
      } else {
        return type;
      }
    });
  });
}

function getTempRows(plan) {
  return plan
    .trim()
    .split("\n")
    .map(l => [...l]);
}

export class Level {
  constructor(plan) {
    let tempRows = getTempRows(plan);
    this.height = tempRows.length;
    this.width = tempRows[0].length;
    this.startActors = [];

    this.rows = createRows(tempRows, this.startActors);
  }
}

Level.prototype.touches = function(pos, size, type) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
      let here = isOutside ? "wall" : this.rows[y][x];
      if (here == type) return true;
    }
  }
  return false;
};
