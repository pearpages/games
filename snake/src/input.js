export const INPUT = {
    keys: {
      UP: 'UP',
      DOWN: 'DOWN',
      LEFT: 'LEFT',
      RIGHT: 'RIGHT',
      SPACE: 'SPACE',
      ENTER: 'ENTER'
    },
    keyPressed: function (keyCode) {
      if (keyCode == 38) {
        return this.keys.UP;
      } else if (keyCode == 40) {
        return this.keys.DOWN;
      } else if (keyCode == 37) {
        return this.keys.LEFT;
      } else if (keyCode == 39) {
        return this.keys.RIGHT;
      } else if (keyCode == 32) {
        return this.keys.SPACE;
      } else if (keyCode == 13) {
        return this.keys.ENTER;
      }
    },
    isKeyCode: (keyCode, key) => INPUT.keyPressed(keyCode) === key
  };