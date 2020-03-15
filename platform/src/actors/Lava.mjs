import { ACTORS, CHARS } from "../models.mjs";
import { Vector } from "../Vector.mjs";
import { State } from "../State.mjs";

export class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() {
    return ACTORS.LAVA;
  }

  static create(pos, char) {
    if (char == CHARS.LAVA_HORIZONTAL) {
      return new Lava(pos, new Vector(2, 0));
    } else if (char == CHARS.LAVA_VERTICAL) {
      return new Lava(pos, new Vector(0, 2));
    } else if (char == CHARS.LAVA_DRIPPING) {
      return new Lava(pos, new Vector(0, 3), pos);
    }
  }
}

Lava.prototype.size = new Vector(1, 1);

Lava.prototype.collide = function(state) {
  return new State(state.level, state.actors, "lost");
};

Lava.prototype.update = function(time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "wall")) {
    return new Lava(newPos, this.speed, this.reset);
  } else if (this.reset) {
    return new Lava(this.reset, this.speed, this.reset);
  } else {
    return new Lava(this.pos, this.speed.times(-1));
  }
};
